<script>
import WarningAlert from "@/components/WarningAlert.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

import UserDataService from "../services/UserDataService.js";



export default {
  name: 'password_change',
  components: {
    WarningAlert, LoadingSpinner
  },
  data() {
    return {
      password: "",
      confirm_password: "",

      error_message: "",
      loading: false,

      valid_token: false,
      user: null
    };
  },
  created() {
    const jwt = this.$route.query.jwt
    const access_token = this.$route.query.access_token
    this.$router.replace({ name: 'password_change' });

    if (jwt && access_token) {
      // Call the service to find user by token
      UserDataService.findByToken(jwt, access_token)
        .then(response => {
          if (response.data.length != 0) {
            this.user = response.data
            return
          }
          else {
            console.log("Username not found:", response);
            this.$router.replace({ name: 'login' });
            return
          }
        })
        .catch(error => {
          console.error("An error occurred while retrieving user:", error);
        });
    }
    else {
      console.log("Access token not provided")
      this.$router.replace({ name: 'login' });
      return
    }
  },
  methods: {
    changePassword() {
      this.error_message = ""

      if (this.password !== this.confirm_password) {
        this.error_message = "The inserted passwords do not match."
      }
      else {
        this.loading = true
        UserDataService.changePassword(this.user.id, { new_password: this.password })
          .then(response => {
            if (response.data.success) {
              this.$router.push({ name: 'login', query: { updated_password: 1 } });
            }
            else {
              this.error_message = response.message
              this.loading = false
            }
          })
          .catch(err => {
            this.error_message = err.message
            this.loading = false
          });

      }

    },

  },
  beforeRouteLeave(to, from, next) {
    // Add a delay before the route change is allowed
    setTimeout(() => {
      next(); // Continue the route transition after a delay
    }, 1000); // 1-second delay
  }
};

</script>

<template>
  <section v-if="user" class="bg-secondary p-3 py-md-5 py-xl-8 ">
    <div class="container ">
      <div class="row gy-4 align-items-center justify-content-center">
        <div class="col-12 col-md-6 col-xl-5">
          <div class="card border-0 rounded-4">
            <div class="card-body p-3 p-md-4 p-xl-5">
              <div class="row">
                <div class="col-12">
                  <div class="mb-4">
                    <h3>Change Password</h3>
                    <p>Please insert a new password.</p>
                  </div>
                </div>
              </div>

              <form class="login-form" @submit.prevent="changePassword">
                <div class="row gy-3 overflow-hidden">

                  <!-- Password -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="password" type="password" class="form-control" name="password"
                        placeholder="Password" required>
                      <label for="password" class="form-label">Password</label>
                    </div>
                  </div>

                  <!-- Confirm Password -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="confirm_password" type="password" class="form-control" name="confirm_password"
                        placeholder="Confirm Password" required>
                      <label for="confirm_password" class="form-label">Confirm Password</label>
                    </div>
                  </div>


                  <div class="col-12">
                    <div class="d-grid">
                      <button class="btn btn-primary btn-lg" type="submit">Change Password</button>
                    </div>
                  </div>

                </div>
              </form>

              <!-- LOADING SPINNER -->
              <LoadingSpinner v-if="loading" />


              <div class="col-12">
                <!-- INCORRECT PASSWORD ALERT -->
                <WarningAlert v-if="error_message" :message="error_message" />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>
