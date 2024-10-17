<script>
import { ref } from 'vue'
import UserDataService from "../services/UserDataService.js";

export default {
  name: 'home_page',
  data() {
    return {
      username: "zeze35h",
      master_student: true,
      table_contents: [],
      row_delete: { first_name: '', last_name: '', email: '', subject: '' },
      row_index: null,
      confirmationModal: false,
      edit: false,
      edit_row: { id: null, first_name: '', last_name: '', email: '', subject: '' }
    };
  },
  created() {
    UserDataService.findAllRelations(this.username)
      .then(response => {
        // Handle successful registration
        for (let i = 0; i < response.data.length; i++) {
          let id = response.data[i].id
          let prof_name = response.data[i].professor.name
          let prof_surname = response.data[i].professor.surname
          let prof_email = response.data[i].professor.email
          let subject_name = response.data[i].subject.name
          this.table_contents.push({ id: id, first_name: prof_name, last_name: prof_surname, email: prof_email, subject: subject_name })
        }
      })
      .catch(error => {
        // Handle errors
        console.error("Error retrieving relations:", error);
      });
  },
  methods: {
    // EDIT
    editRow(index) {
      this.edit = true
      this.edit_row = this.table_contents[index]
      this.row_index = index
    },
    closeEdit() {
      this.edit = false
      this.edit_row = { id: null, first_name: '', last_name: '', email: '', subject: '' }
      this.row_index = null
    },
    confirmEdit(index) {
      this.table_contents[index] = this.edit_row
      console.log(this.edit_row)

      // TODO: HOW THE HELL IS THE USER SUPPOSED TO EDIT THE INFO OF A RELATION WHEN A RELATION CONISTS OF FOREIGN KEYS TO THE USER (STUDENT/PROFESSOR) AND THE SUBJECT TABLES??
      //       IS IT SUPPOSED TO CHANGE THE NAME/SURNAME/EMAIL OF A PROFESSOR OR THE NAME OF A SUBJECT ???

      // UserDataService.editRelation(this.edit_row)
      //   .then(response => {
      //     if (response.data.success) {

      //     }
      //     else {
      //       console.log("An error occurred while changing the password:", response.message);
      //     }
      //   })
      //   .catch(error => {
      //     console.error("An error occurred while changing the password:", error);
      //   });
      this.closeEdit()
    },

    // DELETE
    deleteRowModal(index) {
      this.row_delete = this.table_contents[index]
      this.row_index = index

    },
    confirmDeleteRow() {

      // TODO: SAME QUESTION OF THE EDIT BUT FOR THE DELETE !!!

      this.table_contents.splice(this.index, 1)
      setTimeout(() => {
        this.confirmationModal = true
      }, 500); // 1-second delay

    },
    closeModal() {
      this.row_delete = { first_name: '', last_name: '', email: '', subject: '' }
      this.row_index = null
      this.confirmationModal = false
    }
  }
};

</script>

<template class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">
  <!-- DELETE CONFIRMATION MODAL -->
  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-5"
    aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- MODAL HEADER -->
        <div class="modal-header">
          <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Danger:">
            <use xlink:href="#exclamation-triangle-fill" />
          </svg>
          <h5 class="modal-title" id="staticBackdropLabel">Delete Topic Entry?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <!-- MODAL BODY -->
        <div class="modal-body">
          <strong>Are you sure you want to delete the following topic entry?</strong>
          <div class="table-responsive bg-white my-3">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th scope="col">NAME</th>
                  <th scope="col">SURNAME</th>
                  <th scope="col">E-MAIL</th>
                  <th scope="col">TOPIC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ row_delete.first_name }}</td>
                  <td>{{ row_delete.last_name }}</td>
                  <td>{{ row_delete.email }}</td>
                  <td>{{ row_delete.subject }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- MODAL FOOTER -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button @click="confirmDeleteRow()" type="button" class="btn btn-danger"
            data-bs-dismiss="modal">Delete</button>
        </div>
      </div>
    </div>
  </div>


  <!-- CONFIRMATION MODAL -->
  <div>
    <div v-if="confirmationModal" class="modal fade show d-block" id="exampleModal" tabindex="-1"
      aria-labelledby="exampleModalLabel" aria-hidden="true" style="background: rgba(0, 0, 0, 0.5);"
      @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Topic Entry Deleted</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>Your topic entry has been deleted successfully!</p>
            <div class="table-responsive bg-white my-3">
              <table class="table mb-0">
                <thead>
                  <tr>
                    <th scope="col">NAME</th>
                    <th scope="col">SURNAME</th>
                    <th scope="col">E-MAIL</th>
                    <th scope="col">TOPIC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ row_delete.first_name }}</td>
                    <td>{{ row_delete.last_name }}</td>
                    <td>{{ row_delete.email }}</td>
                    <td>{{ row_delete.subject }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION -->
  <section class="gradient-custom-1 vh-100 p-3 py-md-5 py-xl-8">
    <div class="container px-5">
      <div class="col-12 ">

        <!-- GREETING -->
        <div class="d-flex justify-content-center text-white text-center">
          <div class="col-12 col-xl-9 mb-5">
            <h1>Greetings, {{ username }}!</h1>
          </div>
        </div>

        <!-- TABLE DIV -->
        <div class="card border-0 rounded-4">
          <div class="card-body p-3 p-md-4 p-xl-5">

            <!-- TABLE MESSAGE -->
            <div class="pb-3">
              <h6>List of your professors for this semester:</h6>
            </div>

            <!-- EDIT VIEW -->
            <div v-if="edit" class="table-responsive bg-white">
              <form class="login-form" @submit.prevent="confirmEdit(index)">
                <table class="table mb-0">

                  <!-- TABLE HEAD -->
                  <thead>
                    <tr>
                      <th scope="col">NAME</th>
                      <th scope="col">SURNAME</th>
                      <th scope="col">E-MAIL</th>
                      <th v-if="!master_student" scope="col">SUBJECT</th>
                      <th v-if="master_student" scope="col">TOPIC</th>
                      <th v-if="master_student" scope="col" class="d-flex justify-content-end">ACTIONS</th>
                    </tr>
                  </thead>

                  <!-- TABLE BODY -->
                  <tbody>
                    <template v-for="({ first_name, last_name, email, subject }, index) in table_contents">

                      <!-- ROW EDIT -->
                      <tr v-if="index === this.row_index">
                        <td>
                          <input v-model="edit_row.first_name" type="text" class="form-control" name="first_name"
                            id="first_name" :placeholder="first_name" required>
                        </td>
                        <td>
                          <input v-model="edit_row.last_name" type="text" class="form-control" name="last_name"
                            id="last_name" :placeholder="last_name" required>
                        </td>
                        <td>
                          <input v-model="edit_row.email" type="text" class="form-control" name="email" id="email"
                            :placeholder="email" required>
                        </td>
                        <td>
                          <input v-model="edit_row.subject" type="text" class="form-control" name="subject" id="subject"
                            :placeholder="subject" required>
                        </td>
                        <!-- MASTER STUDENT ACTION BUTTONS -->
                        <td v-if="master_student">
                          <div class="d-flex justify-content-end">

                            <!-- CANCEL BUTTON -->
                            <button @click="closeEdit()" type="button" class="btn btn-outline-secondary me-2"
                              title="Cancel Edit">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-x" viewBox="0 0 16 16">
                                <path
                                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                              </svg>
                            </button>

                            <!-- CONFIRM BUTTON -->
                            <button type="submit" class="btn btn-outline-success" title="Confirm Edit">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-check-lg" viewBox="0 0 16 16">
                                <path
                                  d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>

                      <!-- DISABLED ROWS -->
                      <tr v-else :class="{ 'disabled-row': true }">
                        <td>{{ first_name }}</td>
                        <td>{{ last_name }}</td>
                        <td>{{ email }}</td>
                        <td>{{ subject }}</td>

                        <!-- MASTER STUDENT ACTION BUTTONS -->
                        <td v-if="master_student">
                          <div class="d-flex justify-content-end">

                            <!-- EDIT BUTTON -->
                            <button type="button" class="btn btn-outline-primary me-2" title="Edit" disabled>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-pen" viewBox="0 0 16 16">
                                <path
                                  d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z">
                                </path>
                              </svg>
                            </button>

                            <!-- DELETE BUTTON -->
                            <button @click="deleteRowModal(index)" type="button" class="btn btn-outline-danger"
                              data-bs-toggle="modal" data-bs-target="#staticBackdrop" title="Delete" disabled>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-trash" viewBox="0 0 16 16">
                                <path
                                  d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
                                </path>
                                <path
                                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
                                </path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </template>

                  </tbody>
                </table>
              </form>
            </div>

            <!-- NORMAL VIEW -->
            <div v-else class="table-responsive bg-white">
              <table class="table mb-0">

                <!-- TABLE HEAD -->
                <thead>
                  <tr>
                    <th scope="col">NAME</th>
                    <th scope="col">SURNAME</th>
                    <th scope="col">E-MAIL</th>
                    <th v-if="!master_student" scope="col">SUBJECT</th>
                    <th v-if="master_student" scope="col">TOPIC</th>
                    <th v-if="master_student" scope="col" class="d-flex justify-content-end">ACTIONS</th>
                  </tr>
                </thead>

                <!-- TABLE BODY -->
                <tbody>
                  <tr v-for="({ first_name, last_name, email, subject }, index) in table_contents">
                    <td>{{ first_name }}</td>
                    <td>{{ last_name }}</td>
                    <td>{{ email }}</td>
                    <td>{{ subject }}</td>

                    <!-- MASTER STUDENT ACTION BUTTONS -->
                    <td v-if="master_student">
                      <div class="d-flex justify-content-end">

                        <!-- EDIT BUTTON -->
                        <button @click="editRow(index)" type="button" class="btn btn-outline-primary me-2" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pen" viewBox="0 0 16 16">
                            <path
                              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z">
                            </path>
                          </svg>
                        </button>

                        <!-- DELETE BUTTON -->
                        <button @click="deleteRowModal(index)" type="button" class="btn btn-outline-danger"
                          data-bs-toggle="modal" data-bs-target="#staticBackdrop" title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-trash" viewBox="0 0 16 16">
                            <path
                              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z">
                            </path>
                            <path
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z">
                            </path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>
