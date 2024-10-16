<script>
import UserDataService from "../services/UserDataService.js";
import { defineComponent, ref } from "vue";

export default defineComponent({

  name: "FileUpload",

  data() {
    return {
      profilePictureUrl: "default_picture.png",
      file: null,
    }
  },

  methods: {
    onFileChanged($event) {
      const target = $event.target;
      if (target && target.files) {
        this.file = target.files[0];
        console.log(this.file)
        this.saveImage()
      }
    },

    saveImage() {
      if (this.file) {
        try {

          const formData = new FormData();
          formData.append('file', this.file); // Append the file to the form data

          // Send the formData to the server
          UserDataService.uploadImage(formData)
            .then(response => {
              console.log(response)
              if (response.data.success) {
                this.user.picture = response.data.imageUrl;
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
  }


});

</script>

<template class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">
  <!-- SECTION -->
  <section class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">
    <div class="container px-5">
      <h3>Change Profile Picture</h3>
      <div>
        <input type="file" @change="onFileChanged($event)" accept="image/*" capture />
      </div>
      <img :src="profilePictureUrl" alt="Profile Picture" v-if="profilePictureUrl" width="500px" />
    </div>
  </section>
</template>
