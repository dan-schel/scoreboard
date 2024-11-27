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
      path: "/all",
      name: "all-games",
      component: () => import("../views/AllGames.vue"),
    },
    {
      path: "/:game/:uuid",
      name: "game",
      component: () => import("../views/Game.vue"),
    },
    {
      path: "/:game",
      name: "new-game",
      redirect: (to) => {
        return {
          name: "game",
          params: { game: to.params.game, uuid: uuid() },
          query: to.query,
        };
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "notfound",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

export const routes = {
  home: () => ({ name: "home" }),
  allGames: () => ({ name: "all-games" }),
  openGame: (gameID: string, instanceUUID: string) => ({
    name: "game",
    params: { game: gameID, uuid: instanceUUID },
  }),
  newGame: (gameID: string) => ({
    name: "new-game",
    params: { game: gameID },
  }),
  rematch: (gameID: string, instanceUUID: string) => ({
    name: "new-game",
    params: { game: gameID },
    query: { rematch: instanceUUID },
  }),
};

export default router;
