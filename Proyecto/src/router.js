import { createWebHistory, createRouter } from "vue-router";

const routes =  [
  {
    path: "/",
    alias: "/login",
    name: "login",
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
  {
    path: "/password_reset",
    alias: "/password_reset",
    name: "password_reset",
    component: () => import("./components/PasswordReset.vue")
  },
  {
    path: "/password_change",
    alias: "/password_change",
    name: "password_change",
    component: () => import("./components/PasswordChange.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;