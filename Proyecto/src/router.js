import { createWebHistory, createRouter } from "vue-router";

const routes =  [
  {
    path: "/",
    alias: "/users",
    name: "users",
    component: () => import("./components/Login.vue")
  },
  {
    path: "/register",
    alias: "/register",
    name: "register",
    component: () => import("./components/Register.vue")
  },
  {
    path: "/confirm_email",
    alias: "/confirm_email",
    name: "confirm_email",
    component: () => import("./components/ConfirmEmail.vue")
  },
//   {
//     path: "/tutorials/:id",
//     name: "tutorial-details",
//     component: () => import("./components/Tutorial")
//   },
//   {
//     path: "/add",
//     name: "add",
//     component: () => import("./components/AddTutorial")
//   }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

console.log("AAAAAAAAAAAAAAAAAAAAAAAA")

export default router;