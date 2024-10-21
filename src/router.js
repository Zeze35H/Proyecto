import { createWebHistory, createRouter } from "vue-router";
import http from "./http-common.js";

const routes = [
  {
    path: "/",
    alias: "/login",
    name: "login",
    meta: { requiresNotAuth: true, title: 'SWT - Login' },
    component: () => import("./views/Login.vue")
  },
  {
    path: "/register",
    alias: "/register",
    name: "register",
    meta: { requiresNotAuth: true, title: 'SWT - Register' },
    component: () => import("./views/Register.vue")
  },
  {
    path: "/confirm_email",
    alias: "/confirm_email",
    name: "confirm_email",
    meta: { title: 'SWT - Confirm Email' },
    component: () => import("./views/ConfirmEmail.vue")
  },
  {
    path: "/password_reset",
    alias: "/password_reset",
    name: "password_reset",
    meta: { title: 'SWT - Forgot Password' },
    component: () => import("./views/PasswordReset.vue")
  },
  {
    path: "/password_change",
    alias: "/password_change",
    name: "password_change",
    meta: { title: 'SWT - Password Change' },
    component: () => import("./views/PasswordChange.vue")
  },
  {
    path: "/home_page",
    alias: "/home_page",
    name: "home_page",
    meta: { requiresAuth: true, title: 'SWT - Homepage' },
    component: () => import("./views/HomePage.vue")
  },
  {
    path: "/profile/:username",
    alias: "/profile",
    name: "profile",

    beforeEnter: async (to, from, next) => {
      if (!to.params.username) {
        const response = await http.get('/auth/checkAuth', { withCredentials: true });
        if (response.data.authenticated) {
          document.title = `SWT - ${response.data.user.username}`;
          next(`/profile/${response.data.user.username}`);
        }
        else {
          next('/')
        }
      }
      else {
        document.title = `SWT - ${to.params.username}`;
        next();
      }
    },
    component: () => import("./views/Profile.vue")
  },
  {
    path: "/user_list",
    alias: "/user_list",
    name: "user_list",
    meta: { title: 'SWT - User List' },
    component: () => import("./views/UserList.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {

  document.title = to.meta.title || "SWT"

  try {
    const response = await http.get('/auth/checkAuth', { withCredentials: true });

    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (response.data.authenticated)
        next();
      else {
        next('/')
      }
    }

    else if (to.matched.some(record => record.meta.requiresNotAuth)) {
      if (!response.data.authenticated)
        next();
      else {
        next('/home_page')
      }
    }

    else {
      next()
    }

  } catch (err) {
    next('/');
  }

});

export default router;