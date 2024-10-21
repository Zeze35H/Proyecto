<script>
import UserDataService from "../services/UserDataService.js";

export default {
  name: 'home_page',
  data() {
    return {
      professor: false,
      user: null,

      table_contents: [],

      edit_row: { id: null, name: '', surname: '', email: '', subject: '' },
      row_delete: { name: '', surname: '', email: '', subject: '' },

      edit: false,
      delete: false,

      row_index: null,
      confirmationModal: false,

    };
  },
  props: {
    checkAuthStatus: Function, // Declare the prop
  },
  async created() {

    // CHECK IF USER US AUTHENTICATED
    const result = await this.checkAuthStatus()
    if (result.authenticated) {
      this.user = result.user

      // UPDATE PROFESSOR VARIABLE
      if (this.user.role == 2)
        this.professor = true

      // FIND AUTHENTICATED USER
      UserDataService.findByUsername(this.user.username)
        .then(response => {

          // UPDATE USERS RELATIONS
          if (response.data.length != 0) {
            this.updateRelations()
          }
        })
        .catch(error => {
          // Handle errors
          console.error("Error retrieving relations:", error);
        });
    }
  },
  methods: {

    updateRelations() {
      this.table_contents = []

      // FIND ALL USER'S RELATIONS
      UserDataService.findAllRelations(this.user.id, this.user.role)
        .then(response => {

          // UPDATE RELATIONS ACCORDING TO THE USER'S ROLE
          for (let i = 0; i < response.data.length; i++) {
            if (!this.professor) {
              let id = response.data[i].id
              let name = response.data[i].professor.name
              let surname = response.data[i].professor.surname
              let email = response.data[i].professor.email
              let subject = response.data[i].subject.name
              this.table_contents.push({ id: id, name: name, surname: surname, email: email, subject: subject })
            }
            else {
              let id = response.data[i].id
              let id_student = response.data[i].student.id
              let name = response.data[i].student.name
              let surname = response.data[i].student.surname
              let email = response.data[i].student.email
              let subject = response.data[i].subject.name
              this.table_contents.push({ id: id, id_student: id_student, name: name, surname: surname, email: email, subject: subject })
            }

          }

          console.log(this.table_contents)
        })
        .catch(error => {
          // Handle errors
          console.error("Error retrieving relations:", error);
        });

        
    },

    // CHECK IF ANY CHANGES HAVE BEEN MADE TO THE INPUT FIELDS FOR EDIT
    checkChanges(index) {
      for (var key in this.edit_row) {
        if (key != "token" && this.edit_row[key] != this.table_contents[index][key])
          return true;
      }
      return false;
    },

    // EDIT SELECTED ROW
    editRow(index) {
      this.edit = true
      this.edit_row = { ...this.table_contents[index] }
      this.row_index = index
    },

    // CANCEL ROW EDIT
    closeEdit() {
      this.edit = false
      this.edit_row = { id: null, id_student: null, name: '', surname: '', email: '', subject: '' }
      this.row_index = null
    },

    // UPDATE USER INFO AFTER EDIT
    confirmEdit() {

      // PREPARE DATA FOR BACKEND
      const edit_data = { name: this.edit_row.name, surname: this.edit_row.surname, email: this.edit_row.email }

      UserDataService.update(this.edit_row.id_student, edit_data)
        .then(response => {
          console.log(response)
          if (response.data.success) {
            console.log(response.data.message)

            // UPDATE THE USER LIST AFTER THE UPDATE
            this.updateRelations()

            setTimeout(() => {
              this.confirmationModal = true
            }, 500); // 1-second delay
          }
          else {
            console.log("An error occurred while updating the user:", response.data.message);
          }
        })
        .catch(err => {
          console.error("An error occurred while updating the user:", err);
        });

    },

    // TRIGGER DELETION MODE
    deleteRowModal(index) {
      this.delete = true
      this.row_delete = this.table_contents[index]
      this.row_index = index

    },

    // DELETE USER RELATION
    confirmDeleteRow() {

      UserDataService.delete(this.row_delete.id)
        .then(response => {
          if (response.data.success) {
            console.log(response.data.message)

            // REMOVE USER FROM TBLE
            this.table_contents.splice(this.index, 1)
            setTimeout(() => {
              this.confirmationModal = true
            }, 500); // 1-second delay
          }
          else {
            console.log("An error occurred while deleting the relation:", response.message);
          }
        })
        .catch(error => {
          console.error("An error occurred while deleting the relation:", error);
        });



    },

    // RESET VARIABLES AFTER MODAL CLOSING
    closeModal() {
      this.edit = false
      this.delete = false

      this.edit_row = { id: null, id_student: null, name: '', surname: '', email: '', subject: '' }
      this.row_delete = { name: '', surname: '', email: '', subject: '' }

      this.confirmationModal = false

      this.row_index = null
    }
  }
};

</script>

<template class="p-3 py-md-5 py-xl-8">
  <!-- EDIT AND DELETE CONFIRMATION MODAL -->
  <div class="modal fade" id="editAndDeleteStaticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"
    tabindex="-5" aria-labelledby="editAndDeleteStaticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- MODAL HEADER -->
        <div class="modal-header">
          <svg class="bi flex-shrink-0 me-3" width="24" height="24" role="img" aria-label="Danger:">
            <use xlink:href="#exclamation-triangle-fill" />
          </svg>

          <!-- DELETE MODAL HEADER -->
          <h5 v-if="this.delete" class="modal-title" id="editAndDeleteStaticBackdropLabel">Delete Student Entry?</h5>
          <!-- EDIT MODAL HEADER -->
          <h5 v-else-if="this.edit" class="modal-title" id="editAndDeleteStaticBackdropLabel">Update Student Info?</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>

        <!-- MODAL BODY -->
        <div class="modal-body">
          <strong v-if="this.delete">Are you sure you want to delete the following student entry?</strong>
          <strong v-else-if="this.edit">Are you sure you want to make the following changes to the student?</strong>

          <!-- DELETE MODAL BODY -->
          <div v-if="this.delete" class="table-responsive bg-white my-3">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th scope="col">NAME</th>
                  <th scope="col">SURNAME</th>
                  <th scope="col">E-MAIL</th>
                  <th scope="col">SUBJECT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{ row_delete.name }}</td>
                  <td>{{ row_delete.surname }}</td>
                  <td>{{ row_delete.email }}</td>
                  <td>{{ row_delete.subject }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- EDIT MODAL BODY -->
          <div v-else-if="this.edit" class="table-responsive bg-white my-3">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">BEFORE</th>
                  <th scope="col">AFTER</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Name</strong></td>
                  <td>{{ table_contents[row_index].name }}</td>
                  <td>{{ edit_row.name }}</td>
                </tr>
                <tr>
                  <td><strong>Surname</strong></td>
                  <td>{{ table_contents[row_index].surname }}</td>
                  <td>{{ edit_row.surname }}</td>
                </tr>
                <tr>
                  <td><strong>Email</strong></td>
                  <td>{{ table_contents[row_index].email }}</td>
                  <td>{{ edit_row.email }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- MODAL FOOTER -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>

          <!-- DELETE MODAL FOOTER -->
          <button v-if="this.delete" @click="confirmDeleteRow()" type="button" class="btn btn-danger"
          data-bs-dismiss="modal">Confirm Delete</button>
          <!-- EDIT MODAL FOOTER -->
          <button v-else-if="this.edit" @click="confirmEdit()" type="button" class="btn btn-success"
            data-bs-dismiss="modal">Confirm Changes</button>
        </div>
      </div>
    </div>
  </div>


  <!-- SUCCESS CONFIRMATION MODAL -->
  <div>
    <div v-if="confirmationModal" class="modal fade show d-block" id="homepageConfirmationModal" tabindex="-1"
      aria-labelledby="homepageConfirmationModalLabel" aria-hidden="true" style="background: rgba(0, 0, 0, 0.5);"
      @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content">

          <!-- MODAL HEADER -->
          <div class="modal-header">
            <!-- DELETE MODAL HEADER -->
            <h5 v-if="this.delete" class="modal-title" id="homepageConfirmationModalLabel">Student Entry Deleted</h5>
            <!-- EDIT MODAL HEADER -->
            <h5 v-else-if="this.edit" class="modal-title" id="homepageConfirmationModalLabel">Student Updated
              successfully</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>

          <!-- MODAL BODY -->
          <div class="modal-body">
            <!-- DELETE CONFIRMATION MESSAGE -->
            <p v-if="this.delete">The following student entry has been deleted successfully!</p>
            <!-- EDIT CONFIRMATION MESSAGE -->
            <p v-else-if="this.edit">The following student has been updated successfully!</p>

            <!-- DELETE MODAL BODY -->
            <div v-if="this.delete" class="table-responsive bg-white my-3">
              <table class="table mb-0">
                <thead>
                  <tr>
                    <th scope="col">NAME</th>
                    <th scope="col">SURNAME</th>
                    <th scope="col">E-MAIL</th>
                    <th scope="col">SUBJECT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ row_delete.name }}</td>
                    <td>{{ row_delete.surname }}</td>
                    <td>{{ row_delete.email }}</td>
                    <td>{{ row_delete.subject }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- EDIT MODAL BODY -->
            <div v-else-if="this.edit" class="table-responsive bg-white my-3">
              <table class="table mb-0">
                <thead>
                  <tr>
                    <th scope="col">NAME</th>
                    <th scope="col">SURNAME</th>
                    <th scope="col">E-MAIL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ edit_row.name }}</td>
                    <td>{{ edit_row.surname }}</td>
                    <td>{{ edit_row.email }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- MODAL FOOTER -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION -->
  <section v-if="user" class="gradient-custom-1 vh-100 p-3 py-md-5 py-xl-8">
    <div class="container px-5">
      <div class="col-12 ">

        <!-- USER GREETING -->
        <div class="d-flex justify-content-center text-white text-center">
          <div class="col-12 col-xl-9 mb-5">
            <h1>Greetings, {{ user.name }}!</h1>
          </div>
        </div>

        <!-- TABLE DIV -->
        <div class="card border-0 rounded-4">
          <div v-if="table_contents.length" class="card-body p-3 p-md-4 p-xl-5">

            <!-- TABLE MESSAGE -->
            <div v-if="professor" class="pb-3">
              <h6>List of your students for this semester:</h6>
            </div>
            <div v-else class="pb-3">
              <h6>List of your professors for this semester:</h6>
            </div>

            <!-- EDIT VIEW -->
            <div v-if="edit" class="table-responsive bg-white">
              <form class="login-form" @submit.prevent="">
                <table class="table mb-0">

                  <!-- TABLE HEAD -->
                  <thead>
                    <tr>
                      <th scope="col">NAME</th>
                      <th scope="col">SURNAME</th>
                      <th scope="col">E-MAIL</th>
                      <th scope="col">SUBJECT</th>
                      <th v-if="professor" scope="col" class="d-flex justify-content-end">ACTIONS</th>
                    </tr>
                  </thead>

                  <!-- TABLE BODY -->
                  <tbody>
                    <template v-for="({ name, surname, email, subject }, index) in table_contents">

                      <!-- ROW EDIT -->
                      <tr v-if="index === this.row_index">
                        <td>
                          <input v-model="edit_row.name" type="text" class="form-control" name="name"
                            :placeholder="name" required>
                        </td>
                        <td>
                          <input v-model="edit_row.surname" type="text" class="form-control" name="surname"
                            :placeholder="surname" required>
                        </td>
                        <td>
                          <input v-model="edit_row.email" type="text" class="form-control" name="email"
                            :placeholder="email" required>
                        </td>
                        <td class="disabled-row">
                          {{ subject }}
                        </td>
                        <!-- PROFESSOR ACTION BUTTONS -->
                        <td v-if="professor">
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
                            <button type="submit" class="btn btn-outline-success" data-bs-toggle="modal"
                              data-bs-target="#editAndDeleteStaticBackdrop" title="Confirm Edit"
                              :disabled="!checkChanges(index)" :style="{ opacity: !checkChanges(index) ? 0.2 : 1.0 }">
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
                        <td>{{ name }}</td>
                        <td>{{ surname }}</td>
                        <td>{{ email }}</td>
                        <td>{{ subject }}</td>

                        <!-- PROFESSOR ACTION BUTTONS -->
                        <td v-if="professor">
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
                            <button type="button" class="btn btn-outline-danger" title="Delete" disabled>
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
                    <th scope="col">SUBJECT</th>
                    <th v-if="professor" scope="col" class="d-flex justify-content-end">ACTIONS</th>
                  </tr>
                </thead>

                <!-- TABLE BODY -->
                <tbody>
                  <tr v-for="({ name, surname, email, subject }, index) in table_contents">
                    <td>{{ name }}</td>
                    <td>{{ surname }}</td>
                    <td>{{ email }}</td>
                    <td>{{ subject }}</td>

                    <!-- PROFESSOR ACTION BUTTONS -->
                    <td v-if="professor">
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
                          data-bs-toggle="modal" data-bs-target="#editAndDeleteStaticBackdrop" title="Delete">
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

          <div v-else class="card-body p-3 p-md-4 p-xl-5" >
            <h5 v-if="professor" class="text-center">You're not enrolled in any classes yet!</h5>
            <h5 v-else class="text-center">You do not have any student enrolled in a class you lecture yet!</h5>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
