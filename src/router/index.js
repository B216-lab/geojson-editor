import { createRouter, createWebHistory } from "vue-router";
import routeInterceptor from "./routeInterceptor";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/pages/MapStudio.vue"),
    },
  ],
});

router.beforeEach(routeInterceptor);

export { router };
