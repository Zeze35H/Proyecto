import './assets/main.css'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'; // Import the store
import VueUploadComponent from 'vue-upload-component'

createApp(App).use(router).use(store).component('file-upload', VueUploadComponent).mount('#app')
