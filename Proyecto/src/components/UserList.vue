<script>
import { ref, onMounted, computed } from 'vue'
import UserDataService from "../services/UserDataService.js";

export default {
  name: 'home_page',
  data() {
    return {
      users: [],
      search_users: [],
      query: "",

      students_only: false,
      professors_only: false,
      active_only: true,

      current_page: 1,
      users_per_page: 3,

      no_users: false,
    }
  },
  created() {
    UserDataService.findAllUsers()
      .then(response => {
        if (response.data.length != 0) {
          for (let i = 0; i < response.data.length; i++) {
            let id = response.data[i].id
            let username = response.data[i].username
            let name = response.data[i].name
            let surname = response.data[i].surname
            let email = response.data[i].email
            let role = response.data[i].role == 2 ? "Professor" : "Student"
            let active = response.data[i].active ? "Active" : "Inactive"
            let picture = response.data[i].picture
            this.users.push({ id: id, username: username, name: name, surname: surname, email: email, role: role, active: active, picture: picture })
          }
          console.log(this.users)
          this.search_users = this.users.filter(this.filterUsers)
        }
        else {
          console.log("An error occurred while retrieving the users:", response.message);
        }
      })
      .catch(error => {
        console.error("An error occurred while retrieving the users:", error);
      });
  },
  computed: {
    paginatedUsers() {
      const start = (this.current_page - 1) * this.users_per_page;
      const end = start + this.users_per_page;
      return this.search_users.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.search_users.length / this.users_per_page);
    }
  },
  methods: {
    filterUsers(user) {
      if ((this.query == "" || user.username.toLowerCase().includes(this.query.toLowerCase()) || user.name.toLowerCase().includes(this.query.toLowerCase()) || user.surname.toLowerCase().includes(this.query.toLowerCase()))
        && (!this.active_only || this.active_only && user.active == "Active") && (!this.students_only || this.students_only && user.role == "Student") && (!this.professors_only || this.professors_only && user.role == "Professor"))
        return true;
    },
    search(e) {
      this.no_users = false
      this.current_page = 1
      if (e.target.id == "students_only")
        this.professors_only = false
      if (e.target.id == "professors_only")
        this.students_only = false
      this.search_users = this.users.filter(this.filterUsers)

      if (this.search_users.length == 0)
        this.no_users = true

    },
    nextPage() {
      if (this.current_page < this.totalPages) {
        this.current_page++;
      }
    },
    prevPage() {
      if (this.current_page > 1) {
        this.current_page--;
      }
    },
    selectPage(pageNum) {
      this.current_page = pageNum
    },
  }
}




</script>

<template>

  <!-- SECTION -->
  <section class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">

    <!-- SEARCH FORM -->
    <div class="row height d-flex justify-content-center align-items-center">
      <div class="col-lg-6 mb-3">
        <div class="form">
          <i class="fa fa-search"></i>

          <!-- SEARCH BAR -->
          <input v-model="query" @input="search" type="text" class="form-control form-input"
            placeholder="Search for a user...">

          <!-- SEARCH FILTERS -->
          <div class="text-center text-white mt-2">

            <!-- STUDENTS ONLY -->
            <div class="form-check form-switch form-check-inline">
              <input v-model="students_only" @change="search" class="form-check-input" type="checkbox" role="switch"
                id="students_only">
              <label class="form-check-label" for="students_only">Students Only</label>
            </div>

            <!-- PROFESSORS ONLY -->
            <div class="form-check form-switch form-check-inline">
              <input v-model="professors_only" @change="search" class="form-check-input" type="checkbox" role="switch"
                id="professors_only">
              <label class="form-check-label" for="professors_only">Professors Only</label>
            </div>

            <!-- ACTIVE ONLY -->
            <div class="form-check form-switch form-check-inline">
              <input v-model="active_only" @change="search" class="form-check-input" type="checkbox" role="switch"
                id="active_only">
              <label class="form-check-label" for="active_only">Active Only</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container w-75 px-5 pt-2">
      <ul class="list-group list-group-light">
        <li v-if="no_users" class="list-group-item text-center py-3">No users found matching the search filters.</li>
        <li v-for="({ username, name, surname, email, role, active, picture }, index) in paginatedUsers"
          class="list-group-item row d-flex justify-content-between align-items-center">
          <div class="col-4 d-flex align-items-center">
            <img :src="picture" alt="" style="width: 45px; height: 45px"
              class="rounded-circle" />
            <div class="ms-3">
              <p class="fw-bold mb-1">{{ name }} {{ surname }}</p>
              <p class="text-muted mb-0">{{ username }}</p>
            </div>
          </div>
          <p class="col-2 fw-bold mb-1">{{ email }}</p>
          <p class="col-1 fw-bold mb-1 text-center">{{ role }}</p>
          <p class="col-1 mb-1 text-center">{{ active }}</p>
        </li>
      </ul>
    </div>

    <!-- Pagination Controls -->
    <div class="d-flex justify-content-center align-items-center pt-4">
      <ul class="pagination">
        <li @click="prevPage" :class="{ 'disabled': current_page === 1 }" class="page-item">
          <a class="page-link" href="#">Previous</a>
        </li>

        <li v-for="pageNum in totalPages" :key="pageNum" @click="selectPage(pageNum)"
          :class="{ 'active': pageNum == current_page }" class="page-item">
          <a class="page-link" href="#">{{ pageNum }}</a>
        </li>

        <li @click="nextPage" :class="{ 'disabled': current_page === totalPages }" class="page-item">
          <a class="page-link" href="#">Next</a>
        </li>

        <!-- <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item active" aria-current="page">
          <a class="page-link" href="#">2 <span class="visually-hidden">(current)</span></a>
        </li>
        <li class="page-item"><a class="page-link" href="#">3</a></li> -->
      </ul>
    </div>
  </section>
</template>
