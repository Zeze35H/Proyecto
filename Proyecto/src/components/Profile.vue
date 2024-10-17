<script>
import UserDataService from "../services/UserDataService.js";

import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css"; // Import cropper styles

export default {
  name: 'profile',
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

      edit: false,
      before_edit: { name: "", surname: "", email: "", role: null, token: "" },
      edit_info: { name: "", surname: "", email: "", role: null, token: "" },
      incorrect_token: false,

      authenticated: false,
      auth_user: null,

    };
  },
  props: {
    checkAuthStatus: Function, // Declare the prop
  },
  async created() {

    console.log("created")

    const result = await this.checkAuthStatus()
    if (result) {
      this.authenticated = result.authenticated
      this.auth_user = result.user
    }

    this.profile = this.$route.params.username
    UserDataService.findByUsername(this.profile)
      .then(response => {
        if (response.data.length != 0) {
          console.log("Username found:", response);
          this.user = response.data
          console.log(this.user)
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
      console.log("closeModal")

      this.imageSource = null
      this.croppedImage = null
      this.cropper = null

      this.pictureConfirmationModal = false
      this.infoConfirmationModal = false
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
        console.log(uploadedFile)

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

    dataURLtoBlob(dataURL) {
      // Split the base64 string into parts
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1]; // Get the mime type
      const bstr = atob(arr[1]); // Decode base64
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      // Convert to binary data
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      // Create a Blob object from the binary data and mime type
      return new Blob([u8arr], { type: mime });
    },

    saveImage() {

      if (this.croppedImage) {
        try {

          const blob = this.dataURLtoBlob(this.croppedImage);

          // Prepare the formData for upload
          const formData = new FormData();
          formData.append('file', blob, 'profile_picture.jpg'); // Append the blob as a file

          // Send the formData to the server
          UserDataService.uploadImage(this.user.id, formData)
            .then(response => {
              console.log(response)
              if (response.data.success) {
                console.log(response.data)

                this.user.picture = response.data.imageUrl;
                
                this.pictureConfirmationModal = true
                
                this.resetCropper()
              }
              else {
                console.log("An error occurred while uploading the image:", response.data.message);
              }
            })
            .catch(err => {
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
      console.log(this.user.picture)
      for (var key in d1) {
        if (key != "token" && d1[key] != d2[key])
          return true;
      }
      return false;

    },

    checkChanges() {
      console.log("checkChanges")

      if (this.areDifferent(this.before_edit, this.edit_info)) {
        if (this.before_edit.role != 2 && this.edit_info.role == 2 && this.edit_info.token == "") {
          return false
        }
        return true;
      }
      return false;
    },

    saveChanges() {

      UserDataService.update(this.user.id, this.edit_info)
        .then(response => {
          console.log(response)
          if (response.data.success) {
            console.log(response.data.message)

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
          console.error("An error occurred while updating the user:", err);
        });
    }

  },
};

</script>

<template class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">

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
          <p>Click below to upload a new profile picture.</p>
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

          <!-- Cropper container -->
          <div class="container d-flex justify-content-center mb-5 pb-5">
            <div v-if="imageSource" style="width: 400px; height: 400px;">
              <h5>Crop the Image:</h5>
              <img ref="image" :src="imageSource" alt="Image to Crop" />
              <button @click="cropImage" class="mt-2">Crop Image</button>
            </div>
          </div>


          <!-- Preview the cropped image -->
          <div class="container d-flex justify-content-center">
            <div v-if="croppedImage">
              <h5>Cropped Image Preview:</h5>
              <img :src="croppedImage" alt="Cropped Image" />
            </div>
          </div>
        </div>

        <!-- MODAL FOOTER -->
        <div class="modal-footer">
          <button @click="closeModal()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
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
          <div class="table-responsive bg-white my-3">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">BEFORE</th>
                  <th scope="col">AFTER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Name</strong></td>
                  <td>{{ before_edit.name }}</td>
                  <td>{{ edit_info.name }}</td>
                </tr>
                <tr>
                  <td><strong>Surname</strong></td>
                  <td>{{ before_edit.surname }}</td>
                  <td>{{ edit_info.surname }}</td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>{{ before_edit.email }}</td>
                  <td>{{ edit_info.email }}</td>
                </tr>
                <tr>
                  <td><strong>Role</strong></td>
                  <td v-if="before_edit.role == 2">Professor</td>
                  <td v-else>Student</td>

                  <td v-if="edit_info.role == 2">Professor</td>
                  <td v-else>Student</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- MODAL FOOTER -->
        <div class="modal-footer">
          <button @click="cancelEdit()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button @click="saveChanges()" type="button" class="btn btn-success" data-bs-dismiss="modal">Confirm
            Changes</button>
        </div>
      </div>
    </div>
  </div>



  <!-- PICTURE CONFIRMATION MODAL -->
  <div>
    <div v-if="pictureConfirmationModal" class="modal fade show d-block" id="pictureConfirmationModal" tabindex="-1"
      aria-labelledby="pictureModalLabel" aria-hidden="true" style="background: rgba(0, 0, 0, 0.5);"
      @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Success:">
              <use xlink:href="#check-circle-fill" />
            </svg>
            <h5 class="modal-title" id="pictureModalLabel">Porfile Picture Updated</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>Your profile picture has been changed successfully!</p>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- PICTURE CONFIRMATION MODAL -->
  <div>
    <div v-if="infoConfirmationModal" class="modal fade show d-block" id="infoConfirmationModal" tabindex="-1"
      aria-labelledby="infoModalLabel" aria-hidden="true" style="background: rgba(0, 0, 0, 0.5);"
      @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Success:">
              <use xlink:href="#check-circle-fill" />
            </svg>
            <h5 class="modal-title" id="infoModalLabel">User Info Updated</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>Your info has been updated successfully!</p>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

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
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
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
                        <input v-model="edit_info.role" class="form-check-input" type="radio" name="inlineRadioOptions"
                          id="student_option" value="1" style="cursor: pointer" :checked="user.role != 2">
                        <label class="form-check-label" for="student_option">Student</label>
                      </div>

                      <!-- PROFESSOR OPTION -->
                      <div class="form-check form-check-inline">
                        <input v-model="edit_info.role" class="form-check-input" type="radio" name="inlineRadioOptions"
                          id="professor_option" value="2" style="cursor: pointer" :checked="user.role == 2">
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
                <!-- <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <p class="mb-0">Mobile</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">(098) 765-4321</p>
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <p class="mb-0">Address</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">Bay Area, San Francisco, CA</p>
                  </div>
                </div> -->
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



            <!-- PROJECT STATUS -->
            <!-- <div class="row">
              <div class="col-md-6">
                <div class="card mb-4 mb-md-0">
                  <div class="card-body">
                    <p class="mb-4"><span class="text-primary font-italic me-1">assigment</span> Project Status
                    </p>
                    <p class="mb-1" style="font-size: .77rem;">Web Design</p>
                    <div class="progress rounded" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 80%" aria-valuenow="80"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="mt-4 mb-1" style="font-size: .77rem;">Website Markup</p>
                    <div class="progress rounded" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 72%" aria-valuenow="72"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="mt-4 mb-1" style="font-size: .77rem;">One Page</p>
                    <div class="progress rounded" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 89%" aria-valuenow="89"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="mt-4 mb-1" style="font-size: .77rem;">Mobile Template</p>
                    <div class="progress rounded" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 55%" aria-valuenow="55"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="mt-4 mb-1" style="font-size: .77rem;">Backend API</p>
                    <div class="progress rounded mb-2" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 66%" aria-valuenow="66"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card mb-4 mb-md-0">
                  <div class="card-body">
                    <p class="mb-4"><span class="text-primary font-italic me-1">assigment</span> Project Status
                    </p>
                    <p class="mb-1" style="font-size: .77rem;">Web Design</p>
                    <div class="progress rounded" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 80%" aria-valuenow="80"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="mt-4 mb-1" style="font-size: .77rem;">Website Markup</p>
                    <div class="progress rounded" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 72%" aria-valuenow="72"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="mt-4 mb-1" style="font-size: .77rem;">One Page</p>
                    <div class="progress rounded" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 89%" aria-valuenow="89"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="mt-4 mb-1" style="font-size: .77rem;">Mobile Template</p>
                    <div class="progress rounded" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 55%" aria-valuenow="55"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p class="mt-4 mb-1" style="font-size: .77rem;">Backend API</p>
                    <div class="progress rounded mb-2" style="height: 5px;">
                      <div class="progress-bar" role="progressbar" style="width: 66%" aria-valuenow="66"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div> -->
          </div>

        </div>

      </div>
    </div>
  </section>
</template>
