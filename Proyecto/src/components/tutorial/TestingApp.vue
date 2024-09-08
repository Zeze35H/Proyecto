<script setup>
import { ref, computed, reactive } from 'vue'

const users = ref([
  {username: "zeze", password: "asd123", admin: false},
  {username: "zeze", password: "asd123", admin: true},
  {username: "zeze", password: "asd123", admin: true},
  ])
const username = ref("")
const password = ref("")

const showUsers = ref(true)

const state = reactive({count: 0})

const loginUser = ()=>{
  users.value.push({username: username.value, password: password.value, admin: true})
  username.value = ""
  password.value = ""
}

const toggleShowUsers = (e)=>{ 
  showUsers.value = e
}

const toggleUser = (item)=>{
  item.admin = !item. admin
}

// {} and 'return' can be ommited if its just a oneliner
const charCount = computed( ()=> username.value.length )

const reversedUsers = computed( ()=> {
  return [...users.value].reverse() // [...X] MAKES A COPY OF X
})
</script>

<template>
  <h1>{{ state.count }}</h1>
  <button @click="state.count++">Increase Count</button>
  <br/>
  <div>
    <button 
      class="btn"
      v-if="!showUsers"
      @click="toggleShowUsers(true)">
      Show Users
    </button>
    <button 
      class="btn"
      v-else
      @click="toggleShowUsers(false)">
      Hide Users
    </button>
  </div>

  <ul v-if="showUsers">
    <li v-for="({username, password, admin}, index) in reversedUsers" 
    :key="username"
    class="static-class"
    :class="{strikeout: !admin, priority: admin}"
    @click="toggleUser(users[index])">
    <!-- IS THE SAME AS :class="[{strikeout: !admin}, {priority: admin}]" -->
    <!-- ALTERNATIVE FOR ASSOCIATING CLASSES WITH NO CONDITION :class="['strikeout', 'priority']" -->
      {{ index }}
      {{ password.toLocaleUpperCase() }}</li> 
  </ul>
  <p v-if="!users.length">
    No users
  </p>

  <a v-bind:href="username">Dynamic Link for Username</a>

  <form
    class="login-form"
    @submit.prevent="loginUser">
  
    <input 
      v-model="username" 
      type="text" placeholder="Username">

    <input 
      v-model="password"
      type="text" placeholder="Password">

    <button
      class="btn btn-primary"
      :disabled="username.length === 0 || password.length === 0">
      Login
    </button>

  </form>

  <p class="counter">
    {{ charCount }}/200
  </p>

</template>


<style scoped>
body {
  background: #eff8ff;
  height: 100vh;
  width: 100vw;
  font-family: system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
}

.counter {
  font-size: 0.8rem;
  padding-left: 10px;
  padding-right: 10px;
}

#app {
  background: #fff;
  padding: 2rem;
  margin: 1rem;
  border-radius: 3px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  width: 95%;
  max-width: 900px;
}

h1 {
  color: #3d4852;
}

ul {
  list-style: none;
  padding: 0;
}

a {
  color: #6cb2eb;
  font-size: 1.25rem;
  transition: all 0.1s ease-in;
  margin-top: 0.5rem;
  display: block;
}

a:hover {
  color: #3490dc;
}

li,
p {
  display: flex;
  align-items: center;
  line-height: 1.75;
  letter-spacing: 0.5px;
  color: #3d4852;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.1s ease-in;
}

li:hover {
  color: #22292f;
}

li input {
  margin: 0 0.5rem 0;
}

#shopping-list > input,
#shopping-list > select {
  width: 100%;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f8;
  color: #606f7b;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  font-size: 1rem;
  letter-spacing: 0.5px;
  margin: 0.5rem 0;
}

.add-item-form,
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-item-form input {
  width: 70%;
  border-radius: 3px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f5f8;
  color: #606f7b;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  font-size: 1rem;
  letter-spacing: 0.5px;
  margin: 0.5rem 0;
}

.btn {
  border: none;
  border-radius: 3px;
  margin: auto 0;
  padding: 0.5rem 0.75rem;
  flex-shrink: 0;
  cursor: pointer;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  transition: all 0.1s ease-in;
}

.btn[disabled] {
  background: #8795a1;
}

.btn[disabled]:hover {
  background: #606f7b;
}

.btn-primary {
  background: #6cb2eb;
  color: #fff;
}

.btn-primary:hover {
  background: #3490dc;
}

.btn-cancel {
  background: #ef5753;
  color: #fff;
}

.btn-cancel:hover {
  background: #e3342f;
  color: #fff;
}

.strikeout {
  text-decoration: line-through;
  color: #b8c2cc;
}

.strikeout:hover {
  color: #8795a1;
}

.priority {
  color: #de751f;
}
input[type="checkbox"]{
  display: inline !important;
  box-shadow: none;
  width: auto;
}
</style>



