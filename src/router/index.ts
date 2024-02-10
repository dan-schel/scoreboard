import { createRouter, createWebHistory } from "vue-router";
import { uuid } from "@dan-schel/js-utils";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/Home.vue"),
    },
    {
      path: "/:game/:uuid",
      name: "game",
      component: () => import("../views/Game.vue"),
    },
    {
      path: "/:game",
      redirect: (to) => {
        return { path: `/${to.params.game}/${uuid()}` };
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

export default router;
