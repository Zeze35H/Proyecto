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
      ]
    };
  },
};

</script>

<template>
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
                    <th v-if="master_student" scope="col"></th>
                  </tr>
                </thead>

                <!-- TABLE BODY -->
                <tbody>
                  <tr v-for="({ first_name, last_name, email, subject }, index) in table_contents">
                    <th scope="row">{{ first_name }}</th>
                    <td>{{ last_name }}</td>
                    <td>{{ email }}</td>
                    <td>{{ subject }}</td>

                    <!-- MASTER STUDENT ACTION BUTTONS -->
                    <td v-if="master_student">
                      <div class="d-flex justify-content-end">

                        <!-- EDIT BUTTON -->
                        <button type="button" class="btn btn-outline-primary me-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-pen" viewBox="0 0 16 16">
                            <path
                              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z">
                            </path>
                          </svg>
                        </button>

                        <!-- DELETE BUTTON -->
                        <button type="button" class="btn btn-outline-danger">
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
