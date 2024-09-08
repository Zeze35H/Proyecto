<script setup>
import LoginForm from './components/LoginForm.vue'
</script>

<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <router-link to="/" class="navbar-brand">bezKoder</router-link>
    <div class="navbar-nav mr-auto">
      <li class="nav-item">
        <router-link to="/" class="nav-link">Tutorials</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/" class="nav-link">Add</router-link>
      </li>
    </div>
  </nav>

  <div class="container mt-3">
    <router-view />
  </div>
  <!-- <main>
    <LoginForm />
  </main> -->
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
