<script>
import { ref } from 'vue'
import UserDataService from "../services/UserDataService.js";

// vars
const correct_token = '3rhb23uydb238ry6g2429hrh' // TODO: MOVE TO BACKEND

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "",
      token: "",
      unmatched_passwords: false,
      used_username: false,
      incorrect_token: false,
    };
  },
  methods: {
    selectRole(role) {
      this.role = role
    },
    registerUser() {

      this.unmatched_passwords = false
      this.used_username = false
      this.incorrect_token = false

      if (this.password !== this.confirm_password) {
        this.unmatched_passwords = true
      }

      if (this.role === "Professor" && this.token !== correct_token) {
        this.incorrect_token = true
      }

      const userData = {
        name: this.first_name + ' ' + this.last_name,
        username: this.username,
        email: this.email,
        password: this.password,
        role: this.role,
        token: this.role === "Professor" ? this.token : null,
      };

      // Call the service to save user
      UserDataService.create(userData)
        .then(response => {
          // Handle successful registration
          console.log("User registered:", response);
        })
        .catch(error => {
          // Handle errors
          console.error("Error registering user:", error);
          this.used_username = true
        });
    },
  },
};

</script>

<template>
  <!-- Login 9 - Bootstrap Brain Component -->
  <section class="bg-primary p-3 py-md-5 py-xl-8">
    <div class="container">
      <div class="row gy-4 align-items-center">
        <div class="col-12 col-md-6 col-xl-5">
          <div class="card border-0 rounded-4">
            <div class="card-body p-3 p-md-4 p-xl-5">
              <h3>Register</h3>
              <p>Already have an account? <a href="/">Log in</a></p>

              <form class="register-form" @submit.prevent="registerUser">
                <div class="row gy-3">

                  <!-- Name -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="first_name" type="text" class="form-control" name="first_name" id="first_name"
                        placeholder="Name" required>
                      <label for="first_name" class="form-label">Name</label>
                    </div>
                  </div>

                  <!-- Surname -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="last_name" type="text" class="form-control" name="last_name" id="last_name"
                        placeholder="Surname" required>
                      <label for="last_name" class="form-label">Surname</label>
                    </div>
                  </div>

                  <!-- Username -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="username" type="text" class="form-control" name="username" id="username"
                        placeholder="Username" required>
                      <label for="username" class="form-label">Username</label>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="email" type="email" class="form-control" name="email" id="email"
                        placeholder="E-mail" required>
                      <label for="email" class="form-label">Email</label>
                    </div>
                  </div>

                  <!-- Password -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="password" type="password" class="form-control" name="password" id="password"
                        placeholder="Password" required>
                      <label for="password" class="form-label">Password</label>
                    </div>
                  </div>

                  <!-- Confirm Password -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <input v-model="confirm_password" type="password" class="form-control" name="confirm_password"
                        id="confirm_password" placeholder="Confirm Password" required>
                      <label for="confirm_password" class="form-label">Confirm Password</label>
                    </div>
                  </div>


                  <!-- Role Selection -->
                  <div class="col-12">
                    <div class="form-floating mb-1">
                      <div class="btn-group dropend">
                        <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                          aria-expanded="false">
                          Select a Role
                        </button>
                        <ul class="dropdown-menu">
                          <li><a @click="selectRole('Student')" class="dropdown-item" href="#role">Student</a></li>
                          <li><a @click="selectRole('Professor')" class="dropdown-item" href="#role">Professor</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <!-- Role Display -->
                    <div class="row">
                      <div class="col">
                        <div class="form-floating mb-1">
                          <input v-model="role" type="text" class="form-control" name="role" id="role" placeholder="Role"
                            required disabled>
                          <label for="role" class="form-label">Role</label>
                        </div>
                      </div>

                      <!-- Token for Professors -->
                      <div v-if="role === 'Professor'" class="col">
                        <div class="form-floating mb-1">
                          <input v-model="token" type="text" class="form-control" name="token" id="token"
                            placeholder="Token" required>
                          <label for="token" class="form-label">Token</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Register Button -->
                  <div class="col-12">
                    <div class="d-grid">
                      <button class="btn btn-primary btn-lg" type="submit">Register</button>
                    </div>
                  </div>

                  <div class="col-12">
                    <!-- USED USERNAME ALERT -->
                    <div v-if="used_username" class="alert alert-danger c m-3" role="alert">
                      The inserted username is already in use.
                    </div>

                    <!-- INCORRECT PASSWORD ALERT -->
                    <div v-if="unmatched_passwords" class="alert alert-danger c m-3" role="alert">
                      The inserted passwords do not match.
                    </div>

                    <!-- INCORRECT TOKEN ALERT -->
                    <div v-if="incorrect_token" class="alert alert-danger c m-3" role="alert">
                      The inserted token is incorrect.
                    </div>
                  </div>


                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 col-xl-7">
          <div class="d-flex justify-content-center text-bg-primary">
            <div class="col-12 col-xl-9">
              <img class="img-fluid rounded mb-4" loading="lazy" src="../assets/img/tajaver.png" width="100"
                alt="Vue Logo">
              <hr class="border-primary-subtle mb-4">
              <h2 class="h1 mb-4">School Website Thingy</h2>
              <p class="lead mb-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.</p>
              <div class="text-endx">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor"
                  class="bi bi-grip-horizontal" viewBox="0 0 16 16">
                  <path
                    d="M2 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
