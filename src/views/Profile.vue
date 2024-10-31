<script>
import InfoModal from "@/components/InfoModal.vue";
import BeforeAfterTable from "@/components/BeforeAfterTable.vue";

import UserDataService from "../services/UserDataService.js";

import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"; // Import cropper styles

export default {
  name: 'profile-view',
  components: {
    InfoModal, BeforeAfterTable
  },
  data() {
    return {
      profile: "",
      user: null,

      invalid_file_message: "",

      imageSource: null, // To hold the image source
      croppedImage: null, // To hold the cropped image data
      cropper: null, // Cropper instance

      pictureConfirmationModal: false,
      infoConfirmationModal: false,
      errorModal: false,

      edit: false,
      before_edit: { name: "", surname: "", email: "", role: null, token: "" },
      edit_info: { name: "", surname: "", email: "", role: null, token: "" },
      incorrect_token: false,

      authenticated: false,
      auth_user: null,

      lectured_subjects: null,
      max_students: 5,
    };
  },
  props: {
    checkAuthStatus: Function, // Declare the prop
  },
  emits: ['updatePicture'],
  async created() {

    const result = await this.checkAuthStatus()
    if (result) {
      this.authenticated = result.authenticated
      this.auth_user = result.user
    }

    this.profile = this.$route.params.username
    UserDataService.findByUsername(this.profile)
      .then(response => {
        if (response.data.length != 0) {
          this.user = response.data

          if (this.user.role == 2) {
            this.lectured_subjects = []

            UserDataService.findAllProfessorRelations(this.user.id)
              .then(response => {
                if (response.data.length != 0) {
                  for (let i = 0; i < response.data.length; i++) {
                    let subject = response.data[i].subject_name
                    let num_students = response.data[i].num_students
                    this.lectured_subjects.push({ subject: subject, num_students: num_students })
                  }
                }
              })
              .catch(error => {
                // Handle errors
                console.error("Error retrieving relations:", error);
              });
          }
        }
        else {
          console.log("Username not found:", response);
        }
      })
      .catch(err => {
        // Handle errors
        console.error("Error retrieving user:", err);
      });

  },
  methods: {

    closeModal() {
      this.imageSource = null
      this.croppedImage = null
      this.cropper = null

      this.pictureConfirmationModal = false
      this.infoConfirmationModal = false
      this.errorModal = false
    },

    resetCropper() {
      this.imageSource = null
      this.croppedImage = null
      this.cropper = null
    },

    onFileChanged($event) {

      this.imageSource = null
      this.croppedImage = null
      this.cropper = null

      this.invalid_file_message = ""

      const target = $event.target;
      if (target && target.files) {
        const uploadedFile = target.files[0];

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(uploadedFile.type)) {
          this.invalid_file_message = "Invalid file type. Please upload an image (JPEG, PNG, or GIF)."
          return;
        }

        // Validate file size (optional, e.g., limit to 5MB)
        const maxSizeInMB = 15;
        if (uploadedFile.size > maxSizeInMB * 1024 * 1024) {
          this.invalid_file_message = `File size exceeds ${maxSizeInMB}MB. Please upload a smaller image.`
          return;
        }

        this.imageSource = URL.createObjectURL(uploadedFile);

        // Initialize Cropper.js once the image is loaded
        this.$nextTick(() => {
          const imageElement = this.$refs.image;
          this.cropper = new Cropper(imageElement, {
            aspectRatio: 1, // 1:1 for a square crop
            viewMode: 1, // Restrict the crop box to the size of the canvas
            autoCropArea: 1,
          });
        });

        // Small delay to ensure cropper is ready before assigning the cropped image
        setTimeout(() => {
          this.cropImage(); // Automatically assign the cropped image content
        }, 50);
      }
    },

    cropImage() {
      // Get the cropped image data URL
      if (this.cropper) {
        this.croppedImage = this.cropper.getCroppedCanvas({
          width: 300,
          height: 300, // Resize the image to 300x300
        }).toDataURL("image/jpeg"); // Convert the canvas to a data URL for preview
      }
    },

    saveImage() {

      if (this.croppedImage) {
        try {

          // Prepare the formData for upload
          const formData = new FormData();
          formData.append('imageBase64', this.croppedImage)
          formData.append('old_picture', this.user.picture)

          // Send the formData to the server
          UserDataService.uploadImage(this.user.id, formData)
            .then(response => {
              if (response.data.success) {

                this.user.picture = response.data.imageUrl;

                this.$emit('updatePicture', this.user.picture)

                this.pictureConfirmationModal = true

                this.resetCropper()
              }
              else {
                this.errorModal = true
                console.log("An error occurred while uploading the image:", response.data.message);
              }
            })
            .catch(err => {
              this.errorModal = true
              console.error("An error occurred while uploading the image:", err);
            });
        } catch (err) {
          console.error(err);
        }
      }
    },

    editInfo() {
      this.edit = true
      this.edit_info = { name: this.user.name, surname: this.user.surname, email: this.user.email, role: this.user.role, token: "" }
      this.before_edit = { ...this.edit_info }
    },

    cancelEdit() {
      this.incorrect_token = false
      this.edit = false
      this.edit_info = { name: "", surname: "", email: "", role: null, token: "" }
    },

    areDifferent(d1, d2) {
      for (var key in d1) {
        if (key != "token" && d1[key] != d2[key])
          return true;
      }
      return false;
    },

    checkChanges() {
      if (this.areDifferent(this.before_edit, this.edit_info)) {
        if (this.before_edit.role != 2 && this.edit_info.role == 2 && this.edit_info.token == "") {
          return false
        }
        return true;
      }
      return false;
    },

    saveChanges() {

      if (this.before_edit.role == 2)
        delete this.edit_info["token"]

      UserDataService.update(this.user.id, this.edit_info)
        .then(response => {
          if (response.data.success) {

            this.user.name = this.edit_info.name
            this.user.surname = this.edit_info.surname
            this.user.email = this.edit_info.email
            this.user.role = this.edit_info.role

            this.cancelEdit()
            this.infoConfirmationModal = true
          }
          else {
            console.log("An error occurred while updating the user:", response.data.message);
            this.incorrect_token = true
          }
        })
        .catch(err => {
          this.errorModal = true
          console.error("An error occurred while updating the user:", err);
        });
    }

  },

};

</script>

<template class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">
  <div>
    <!-- CHANGE PICTURE MODAL -->
    <div class="modal fade" id="pictureModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-5"
      aria-labelledby="pictureModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">

          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h5 class="modal-title" id="pictureModalLabel">Change Profile Picture</h5>
            <button @click="closeModal()" type="button" class="btn-close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>

          <!-- MODAL BODY -->
          <div class="modal-body">
            <p>Click below to upload a new profile picture</p>
            <div class="mb-3">
              <input type="file" @click="resetCropper()" @change="onFileChanged($event)" accept="image/*" capture />
            </div>

            <div v-if="invalid_file_message" class="alert alert-danger d-flex align-items-center c m-3" role="alert">
              <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Danger:">
                <use xlink:href="#exclamation-triangle-fill" />
              </svg>
              <div>
                {{ invalid_file_message }}
              </div>
            </div>


            <div class="d-flex justify-content-center align-items-center">
              <!-- Cropper container -->
              <div class="container d-flex justify-content-center mb-5 pb-5">
                <div v-if="imageSource" style="width: 250px; height: 250px;">
                  <h5>Crop the original picture if necessary:</h5>
                  <img ref="image" :src="imageSource" alt="Image to Crop" />
                  <button @click="cropImage" class="btn btn-primary mt-2">Crop Image</button>
                </div>
              </div>


              <!-- Preview the cropped image -->
              <div class="container d-flex justify-content-center">
                <div v-if="croppedImage">
                  <h5>Profile Picture Preview:</h5>
                  <img :src="croppedImage" class="rounded-circle img-fluid" alt="Cropped Image" />
                </div>
              </div>

            </div>

          </div>

          <!-- MODAL FOOTER -->
          <div class="modal-footer">
            <button @click="closeModal()" type="button" class="btn btn-secondary"
              data-bs-dismiss="modal">Cancel</button>
            <button @click="saveImage()" type="button" class="btn btn-success" data-bs-dismiss="modal"
              :disabled="!croppedImage">Upload Image</button>
          </div>
        </div>
      </div>
    </div>

    <!-- CHANGE INFO MODAL -->
    <div class="modal fade" id="infoModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-5"
      aria-labelledby="infoModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">

          <!-- MODAL HEADER -->
          <div class="modal-header">
            <h5 class="modal-title" id="infoModalLabel">Update User Info</h5>
            <button @click="closeModal()" type="button" class="btn-close" data-bs-dismiss="modal"
              aria-label="Close"></button>
          </div>

          <!-- MODAL BODY -->
          <div class="modal-body">
            <strong>Are you sure you want to make the following changes?</strong>

            <BeforeAfterTable :fields="['Name', 'Surname', 'Email', 'Role']"
              :before="[before_edit.name, before_edit.surname, before_edit.email, before_edit.role == 2 ? 'Professor' : 'Student']"
              :after="[edit_info.name, edit_info.surname, edit_info.email, edit_info.role == 2 ? 'Professor' : 'Student']" />
          </div>

          <!-- MODAL FOOTER -->
          <div class="modal-footer">
            <button @click="cancelEdit()" type="button" class="btn btn-secondary"
              data-bs-dismiss="modal">Cancel</button>
            <button @click="saveChanges()" type="button" class="btn btn-success" data-bs-dismiss="modal">Confirm
              Changes</button>
          </div>
        </div>
      </div>
    </div>


    <InfoModal v-if="pictureConfirmationModal" @closeModal="closeModal" header_message="Porfile Picture Updated"
      body_message="Your profile picture has been changed successfully!" />

    <InfoModal v-if="infoConfirmationModal" @closeModal="closeModal" header_message="User Info Updated"
      body_message="Your info has been updated successfully!" />

    <InfoModal v-if="errorModal" @closeModal="closeModal" :error="true" header_message="Some error occurred"
      body_message="Some error occurred updating your profile. Your changes were not saved."></InfoModal>


    <!-- SECTION -->
    <section class="gradient-custom-1 vh-100 p-3 py-md-5 py-xl-8">
      <div class="container px-5">
        <div class="col-12 ">

          <div v-if="user" class="row">

            <!-- PROFILE CARD -->
            <div class="col-lg-4">
              <div class="card mb-4">
                <div class="card-body">

                  <!-- Profile Picture Display -->
                  <div class="d-flex justify-content-center">
                    <!-- Profile Picture Upload Icon -->

                    <img :src="user.picture" alt="Profile Picture" class="rounded-circle img-fluid"
                      style="width: 150px;" />
                    <svg v-if="!edit && authenticated && user.id === auth_user.id" data-bs-toggle="modal"
                      data-bs-target="#pictureModal" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                      fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16" style="cursor: pointer">
                      <path
                        d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                  </div>

                  <h5 class="mt-3">{{ user.name }} {{ user.surname }}</h5>
                  <p v-if="user.active" class="text-muted mb-2">Active user</p>
                  <p v-else class="text-muted mb-2">Inactive user</p>
                </div>
              </div>
            </div>

            <!-- INFO CARD -->
            <div class="col-lg-8">
              <div class="card mb-4">
                <div class="card-body position-relative" :class="{ 'pb-0': edit }">

                  <!-- EDIT BUTTON -->
                  <svg v-if="!edit && authenticated && user.id === auth_user.id" @click="editInfo()"
                    xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                    class="bi bi-pencil-square position-absolute top-0 end-0 m-2" viewBox="0 0 16 16"
                    style="cursor: pointer">
                    <path
                      d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fill-rule="evenodd"
                      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                  </svg>

                  <!-- NAME FIELD -->
                  <div class="row d-flex align-items-center">
                    <div class="col-sm-3">
                      <p class="mb-0">Name</p>
                    </div>
                    <div class="col-sm-9">
                      <input v-model="edit_info.name" v-if="edit" type="text" class="form-control"
                        :placeholder="user.name" required>
                      <p v-else class="text-muted mb-0">{{ user.name }}</p>
                    </div>
                  </div>
                  <hr>

                  <!-- SURNAME FIELD -->
                  <div class="row d-flex align-items-center">
                    <div class="col-sm-3">
                      <p class="mb-0">Surname</p>
                    </div>
                    <div class="col-sm-9">
                      <input v-model="edit_info.surname" v-if="edit" type="text" class="form-control"
                        :placeholder="user.surname" required>
                      <p v-else class="text-muted mb-0">{{ user.surname }}</p>
                    </div>
                  </div>
                  <hr>

                  <!-- EMAIL FIELD -->
                  <div class="row d-flex align-items-center">
                    <div class="col-sm-3">
                      <p class="mb-0">Email</p>
                    </div>
                    <div class="col-sm-9">
                      <input v-model="edit_info.email" v-if="edit" type="text" class="form-control"
                        :placeholder="user.email" required>
                      <p v-else class="text-muted mb-0">{{ user.email }}</p>
                    </div>
                  </div>
                  <hr>

                  <!-- ROLE FIELD -->
                  <div class="row d-flex align-items-center">
                    <div class="col-sm-3">
                      <p class="mb-0">Role</p>
                    </div>
                    <div class="col-sm-9">
                      <div v-if="edit" class="d-flex align-items-center">

                        <!-- STUDENT OPTION -->
                        <div class="form-check form-check-inline">
                          <input v-model="edit_info.role" class="form-check-input" type="radio"
                            name="inlineRadioOptions" id="student_option" value="1" style="cursor: pointer"
                            :checked="user.role != 2">
                          <label class="form-check-label" for="student_option">Student</label>
                        </div>

                        <!-- PROFESSOR OPTION -->
                        <div class="form-check form-check-inline">
                          <input v-model="edit_info.role" class="form-check-input" type="radio"
                            name="inlineRadioOptions" id="professor_option" value="2" style="cursor: pointer"
                            :checked="user.role == 2">
                          <label class="form-check-label" for="professor_option">Professor</label>
                        </div>
                        <input v-model="edit_info.token" v-if="edit && edit_info.role == 2" type="text"
                          class="form-control" placeholder="Token" required>
                      </div>

                      <div v-else>
                        <p v-if="user.role == 2" class="text-muted mb-0">Professor</p>
                        <p v-else class="text-muted mb-0">Student</p>
                      </div>


                    </div>
                  </div>
                  <hr v-if="edit">

                </div>
                <div v-if="incorrect_token" class="alert alert-danger d-flex align-items-center c m-3" role="alert">
                  <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Danger:">
                    <use xlink:href="#exclamation-triangle-fill" />
                  </svg>
                  <div>
                    The inserted token is incorrect.
                  </div>
                </div>
                <div v-if="edit" class="d-flex justify-content-end mb-3 me-3">
                  <button @click="cancelEdit()" type="button" class="btn btn-secondary me-2"
                    data-bs-dismiss="modal">Cancel</button>
                  <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#infoModal"
                    :disabled="!checkChanges()">Save Changes</button>
                </div>
              </div>

              <!-- LECTURED SUBJECTS -->
              <div v-if="user.role == 2" class="col-md-12">
                <div class="card mb-4 mb-md-0">
                  <div v-if="lectured_subjects.length" class="card-body">
                    <div class="d-flex d-flex justify-content-between">
                      <h5 class="text-primary font-italic mb-3">Lectured Subjects</h5>
                      <p class="text-muted" style="font-size: .75rem;">Num. of Students</p>
                    </div>


                    <div v-for="({ subject, num_students }, index) in lectured_subjects" :key="index">
                      <div class="d-flex d-flex justify-content-between">
                        <p class="mb-1">{{ subject }}</p>
                        <p class="mb-1" style="font-size: .90rem;">{{ num_students }}</p>
                      </div>
                      <div class="progress rounded" style="height: 5px;">
                        <div class="progress-bar" role="progressbar"
                          :style="{ width: `${num_students / max_students * 100}%` }" :aria-valuenow="num_students"
                          aria-valuemin="0" :aria-valuemax="max_students"></div>
                      </div>
                    </div>


                  </div>
                  <div v-else class="card-body p-3 p-md-4 p-xl-5">
                    <h5 class="text-center">You do not have any students enrolled in a class you lecture yet!</h5>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  </div>
</template>
