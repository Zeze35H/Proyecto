import { createWebHistory, createRouter } from "vue-router";

const routes =  [
  {
    path: "/",
    alias: "/users",
    name: "users",
    component: () => import("./components/LoginForm.vue")
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