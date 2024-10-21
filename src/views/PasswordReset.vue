<script>
import { ref } from 'vue'
import UserDataService from "../services/UserDataService.js";


export default {
  name: 'password_reset',
  data() {
    return {
      email: "",

      loading: false,

      no_account: false,
      inactive_account: false,
      reset_sent: false,
    };
  },
  methods: {
    resetPassword() {
      this.no_account = false
      this.inactive_account = false
      this.reset_sent = false

      this.loading = true


      UserDataService.findByEmail(this.email)
        .then(response => {
          if (response.data.length == 0) {
            console.log("Email not found:", response);
            this.no_account = true
            this.loading = false
            return
          }
          else {
            console.log("Email found:", response);
            if (!response.data.active) {
              console.log("User inactive:", response);
              this.inactive_account = true
              this.loading = false
              return
            }
            else {
              console.log("Active user with email found!", response.data)
              UserDataService.resetPassword(response.data)
                .then(response => {
                  console.log("Reset Password email sent", response)
                  this.reset_sent = true
                  this.loading = false
                })
                .catch(e => {
                  console.log(e);
                });
            }
          }
        })
        .catch(e => {
          console.log(e);
        });



    },

  }
};

</script>

<template>
  <section class="gradient-custom-2 p-3 py-md-5 py-xl-8 ">
    <div class="container ">
      <div class="row gy-4 align-items-center justify-content-center">
        <div class="col-12 col-md-6 col-xl-5">
          <div class="card border-0 rounded-4">
            <div class="card-body p-3 p-md-4 p-xl-5">
              <div class="row">
                <div class="col-12">
                  <div class="mb-4">
                    <h3>Password Reset</h3>
                    <p>Please insert the e-mail linked to your account.</p>
                  </div>
                </div>
              </div>

              <form class="login-form" @submit.prevent="resetPassword">
                <div class="row gy-3 overflow-hidden">

                  <!-- Email -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="email" type="email" class="form-control" name="email" placeholder="E-mail"
                        required>
                      <label for="email" class="form-label">Email</label>
                    </div>
                  </div>


                  <div class="col-12">
                    <div class="d-grid">
                      <button class="btn btn-primary btn-lg" type="submit">Reset Password</button>
                    </div>
                  </div>

                </div>
              </form>

              <!-- LOADING SPINNER -->
              <div class="col-12 d-flex justify-content-center mt-4">
                <div v-if="loading" class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div class="col-12">



                <!-- NO ACCOUNT ALERT -->
                <div v-if="no_account" class="alert alert-danger d-flex align-items-center c m-3" role="alert">
                  <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Danger:">
                    <use xlink:href="#exclamation-triangle-fill" />
                  </svg>
                  <div>
                    There is no account linked to the inserted e-mail. Please try another e-mail.
                  </div>
                </div>

                <!-- INACTIVE ACCOUNT ALERT -->
                <div v-else-if="inactive_account" class="alert alert-danger d-flex align-items-center c m-3"
                  role="alert">
                  <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Danger:">
                    <use xlink:href="#exclamation-triangle-fill" />
                  </svg>
                  <div>
                    Your account is inactive and it is not possible to reset the password. Please create a new account.
                  </div>
                </div>


                <!-- SUCCESS RESET SENT -->
                <div v-else-if="reset_sent" class="alert alert-success d-flex align-items-center c m-3" role="alert">
                  <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Success:">
                    <use xlink:href="#check-circle-fill" />
                  </svg>
                  <div>
                    An e-mail with a password reset link has been sent to your e-mail!
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>
