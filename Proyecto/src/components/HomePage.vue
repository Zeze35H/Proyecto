<script>
import { ref } from 'vue'
import UserDataService from "../services/UserDataService.js";

export default {
  data() {
    return {
      username: "Zezé",
      master_student: true,
      table_contents: [
        { first_name: 'Jose Eduardo', last_name: 'Henriques', email: 'zezeh35@hotmail.com', subject: 'Maths' },
        { first_name: 'Pedro Miguel', last_name: 'Lages', email: 'pml00@gmail.com', subject: 'Biology' },
        { first_name: 'Anais', last_name: 'Neto', email: 'nisneto123@outlook.com', subject: 'Psychology' },
        { first_name: 'Margarida', last_name: 'Garcia', email: 'mariamargaridag@hotmail.com', subject: 'Chemistry' },
        { first_name: 'Filippa', last_name: 'Psychomani', email: 'filippapsi@gmail.com', subject: 'Statistics' },
      ],
      row_delete: { first_name: '', last_name: '', email: '', subject: '' },
      row_index: null,
      confirmationModal: false,
    };
  },
  methods: {
    deleteRowModal(index) {
      this.row_delete = this.table_contents[index]
      this.row_index = index

    },
    confirmDeleteRow() {
      this.table_contents.splice(this.index,1)
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
          <button @click="confirmDeleteRow()" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
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
  <section class="gradient-custom-1 h-100 p-3 py-md-5 py-xl-8">
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
            <div class="table-responsive bg-white">
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
                        <button type="button" class="btn btn-outline-primary me-2" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pen" viewBox="0 0 16 16">
                            <path
                              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z">
                            </path>
                          </svg>
                        </button>

                        <!-- DELETE BUTTON -->
                        <button @click="deleteRowModal(index)" type="button"
                          class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                          title="Delete">
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
