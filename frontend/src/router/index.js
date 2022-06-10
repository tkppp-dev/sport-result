import { createRouter, createWebHistory } from "vue-router";
import Kbo from "../views/Kbo.vue";
import Nba from '../views/Nba.vue'
import Lck from '../views/Lck.vue'

const routes = [
  {
    path: "/",
    name: "Kbo",
    component: Kbo,
  },
  {
    path: "/kbo",
    name: "Kbo",
    component: Kbo,
  },
  {
    path: "/nba",
    name: "Nba",
    component: Nba,
  }, 
  {
    path: '/lck',
    name: 'Lck',
    component: Lck
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
