import { createWebHistory, createRouter } from "vue-router";
import axios from "axios";

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
  {
    path: "/home_page",
    alias: "/home_page",
    name: "home_page",
    meta: { requiresAuth: true },
    component: () => import("./components/HomePage.vue")
  },
  {
    path: "/profile",
    alias: "/profile",
    name: "profile",
    meta: { requiresAuth: true },
    component: () => import("./components/ProfileTest.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    try {
      const response = await axios.get('http://localhost:8080/api/auth/checkAuth', { withCredentials: true });
      if (response.data.authenticated) {
        next();
      } else {
        next('/');
      }
    } catch (err) {
      next('/');
    }
  } else {
    next();
  }
});

export default router;