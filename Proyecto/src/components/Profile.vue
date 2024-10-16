<script>
import UserDataService from "../services/UserDataService.js";


export default {
  name: 'profile',
  data() {
    return {
      profile: "zeze35h",
      user: null,

      profilePictureUrl: null,
      file: null,
      upload_success: false,
    };
  },
  created() {
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
    onFileChanged($event) {
      this.upload_success = false
      const target = $event.target;
      if (target && target.files) {
        this.file = target.files[0];
        console.log(this.file)
        this.profilePictureUrl = URL.createObjectURL(this.file)
      }
    },

    saveImage() {
      if (this.file) {
        try {

          const formData = new FormData();
          formData.append('file', this.file); // Append the file to the form data

          // Send the formData to the server
          UserDataService.uploadImage(this.user.id, formData)
            .then(response => {
              console.log(response)
              if (response.data.success) {
                this.user.picture = response.data.imageUrl;
                this.profilePictureUrl = null
                this.file = null
                this.upload_success = true
                console.log(response.data.message)
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
          this.file = null;
        }
      }
    }

  },
};

</script>

<template class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">
  <!-- SECTION -->
  <section class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">
    <div class="container px-5">
      <div class="col-12 ">

        <div v-if="user" class="row">

          <!-- PROFILE CARD -->
          <div class="col-lg-4">
            <div class="card mb-4">
              <div class="card-body position-relative">
                <!-- Profile Picture Upload Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-pencil-square position-absolute top-0 end-0" viewBox="0 0 16 16" style="cursor: pointer">
                  <path
                    d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path fill-rule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                </svg>

                <!-- Profile Picture Display -->
                <img :src="user.picture" alt="avatar" class="rounded-circle img-fluid" style="width: 150px;" />

                <h5 class="my-3">{{ user.name }} {{ user.surname }}</h5>
                <p v-if="user.role == 2" class="text-muted mb-1">Professor</p>
                <p v-else class="text-muted mb-1">Student</p>
                <p v-if="user.active" class="text-muted mb-4">Active user</p>
                <p v-else class="text-muted mb-4">Inactive user</p>


                <h3>Change Profile Picture</h3>
                <div>
                  <input type="file" @change="onFileChanged($event)" accept="image/*" capture />
                </div>
                <img :src="profilePictureUrl" alt="Profile Picture" v-if="profilePictureUrl" width="200px" />
                <button v-if="file" @click="saveImage">Upload Image</button>
              </div>
            </div>
          </div>

          <!-- INFO CARD -->
          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3">
                    <p class="mb-0">Name</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ user.name }}
                    </p>
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <p class="mb-0">Surname</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ user.surname }}</p>
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <p class="mb-0">Email</p>
                  </div>
                  <div class="col-sm-9">
                    <p class="text-muted mb-0">{{ user.email }}</p>
                  </div>
                </div>
                <hr>
                <div class="row">
                  <div class="col-sm-3">
                    <p class="mb-0">Role</p>
                  </div>
                  <div class="col-sm-9">
                    <p v-if="user.role == 2" class="text-muted mb-0">Professor</p>
                    <p v-else class="text-muted mb-0">Student</p>
                  </div>
                </div>
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

          <!-- SUCCESS RESET SENT -->
          <div v-if="upload_success" class="alert alert-success d-flex align-items-center c m-3" role="alert">
            <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Success:">
              <use xlink:href="#check-circle-fill" />
            </svg>
            <div>
              Your profile picture has been successfuly updated!
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>
