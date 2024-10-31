<script>
import WarningAlert from "@/components/WarningAlert.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

import UserDataService from "../services/UserDataService.js";


export default {
  name: 'password_reset',
  components: {
    WarningAlert, LoadingSpinner
  },
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
            this.no_account = true
            this.loading = false
            return
          }
          else {
            if (!response.data.active) {
              this.inactive_account = true
              this.loading = false
              return
            }
            else {
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
              <LoadingSpinner v-if="loading" />

              <div class="col-12">



                <!-- NO ACCOUNT ALERT -->
                <WarningAlert v-if="no_account" message="There is no account linked to the inserted e-mail. Please try another e-mail." />
                <WarningAlert v-if="inactive_account" message="Your account is inactive and it is not possible to reset the password. Please create a new account." />

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
