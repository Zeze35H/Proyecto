<script>
import { ref } from 'vue'
import UserDataService from "../services/UserDataService.js";

export default {

};

</script>

<template>
  <!-- Login 9 - Bootstrap Brain Component -->
  <section class="bg-primary p-3 py-md-5 py-xl-8">
    <div class="container">
      <div class="d-flex justify-content-center text-bg-primary">
        <div class="col-12 col-xl-9">
          <img class="img-fluid rounded mb-4" loading="lazy" src="../assets/img/tajaver.png" width="100" alt="Vue Logo">
          <hr class="border-primary-subtle mb-4">
          <h2 class="h1 mb-4">You've got mail!</h2>
          <p class="lead mb-5">An e-mail has been sent to your inbox with a link to confirm your registration. Click it to
            complete your account creation.</p>
        </div>
      </div>
    </div>
  </section>
</template>
