import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";
import Game from "../pages/Game.vue";
import Leaderboard from "../pages/Leaderboard.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: Login },
    { path: "/", component: Game },
    { path: "/leaderboard", component: Leaderboard },
  ],
});

export default router;
