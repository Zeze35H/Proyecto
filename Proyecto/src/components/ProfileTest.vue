<script>
import UserDataService from "../services/UserDataService.js";

export default {
  name: 'profile_test',
  data() {
    return {
      profilePictureUrl: ''
    };
  },
  methods: {

    uploadImage(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      axios.post('your-upload-endpoint', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        
      })
      .catch(error => {
        
      });
    }
  },
};

</script>

<template class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">
  <!-- SECTION -->
  <section class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">
    <div class="container px-5">
      <h3>Change Profile Picture</h3>
      <input type="file" @change="uploadImage" accept="image/*" />
      <img :src="profilePictureUrl" alt="Profile Picture" v-if="profilePictureUrl" />
    </div>
  </section>
</template>
