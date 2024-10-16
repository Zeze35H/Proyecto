import { createWebHistory, createRouter } from "vue-router";
import axios from "axios";

const routes = [
  {
    path: "/",
    alias: "/login",
    name: "login",
    meta: { requiresNotAuth: true },
    component: () => import("./components/Login.vue")
  },
  {
    path: "/register",
    alias: "/register",
    name: "register",
    meta: { requiresNotAuth: true },
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
    component: () => import("./components/tutorial/TestingApp.vue")
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
    // meta: { requiresAuth: true },
    component: () => import("./components/Profile.vue")
  },
  {
    path: "/profile_test",
    alias: "/profile_test",
    name: "profile_test",
    // meta: { requiresAuth: true },
    component: () => import("./components/ProfileTest.vue")
  },
  {
    path: "/user_list",
    alias: "/user_list",
    name: "user_list",
    component: () => import("./components/UserList.vue")
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  try {
    const response = await axios.get('http://localhost:8080/api/auth/checkAuth', { withCredentials: true });

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