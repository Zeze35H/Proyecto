<script setup>
</script>

<template>
  <div class="login-page">
       <transition name="fade">
          <div v-if="!registerActive" class="wallpaper-login"></div>
       </transition>
       <div class="wallpaper-register"></div>
 
       <div class="container">
          <div class="row">
             <div class="">
                <div v-if="!registerActive" class="card login" v-bind:class="{ error: emptyFields }">
                   <h1>Sign In</h1>
                   <form class="form-group">
                      <input v-model="emailLogin" type="email" class="form-control" placeholder="Email" required>
                      <input v-model="passwordLogin" type="password" class="form-control" placeholder="Password" required>
                      <input type="submit" class="btn btn-primary" @click="doLogin">
                      <p>Don't have an account? <a href="#" @click="registerActive = !registerActive, emptyFields = false">Sign up here</a>
                      </p>
                      <p><a href="#">Forgot your password?</a></p>
                   </form>
                </div>
 
                <div v-else class="card register" v-bind:class="{ error: emptyFields }">
                   <h1>Sign Up</h1>
                   <form class="form-group">
                      <input v-model="emailReg" type="email" class="form-control" placeholder="Email" required>
                      <input v-model="passwordReg" type="password" class="form-control" placeholder="Password" required>
                      <input v-model="confirmReg" type="password" class="form-control" placeholder="Confirm Password" required>
                      <input type="submit" class="btn btn-primary" @click="doRegister">
                      <p>Already have an account? <a href="#" @click="registerActive = !registerActive, emptyFields = false">Sign in here</a>
                      </p>
                   </form>
                </div>
             </div>
          </div>
 
       </div>
    </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
