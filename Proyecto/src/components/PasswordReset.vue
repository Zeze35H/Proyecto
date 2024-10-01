<script>
import { ref } from 'vue'
import UserDataService from "../services/UserDataService.js";


export default {
  data() {
    return {
      email: "",
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


      UserDataService.findByEmail(this.email)
        .then(response => {
          console.log(response.data)
          if (response.data.length == 0) {
            console.log("Email not found:", response);
            this.no_account = true
            return
          }
          else {
            console.log("Email found:", response);
            if (!response.data.active) {
              console.log("User inactive:", response);
              this.inactive_account = true
              return
            }
            else {
              console.log("Active user with email found!", response.data)
              UserDataService.resetPassword(response.data)
                .then(response => {
                  console.log(response)
                  this.reset_sent = false
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
  <section class="bg-secondary p-3 py-md-5 py-xl-8 ">
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
                      <input v-model="email" type="email" class="form-control" name="email" id="email"
                        placeholder="E-mail" required>
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

              <div class="col-12">
                <!-- NO ACCOUNT ALERT -->
                <div v-if="no_account" class="alert alert-danger c m-3" role="alert">
                  There is no account linked to the inserted e-mail. Please try another e-mail.
                </div>

                <!-- INACTIVE ACCOUNT ALERT -->
                <div v-else-if="inactive_account" class="alert alert-danger c m-3" role="alert">
                  Your account is inactive and it is not possible to reset the password. Please create a new account.
                </div>

                <!-- INCORRECT TOKEN ALERT -->
                <div v-else-if="reset_sent" class="alert alert-success c m-3" role="alert">
                  An e-mail with a password reset link had been sent to your e-mail!
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>
