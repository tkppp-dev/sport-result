import { createRouter, createWebHistory } from "vue-router";
import Kbo from "../views/Kbo.vue";
import Nba from '../views/Nba.vue'
import Lck from '../views/Lck.vue'
import { nextTick } from "vue";

const baseName = 'Sport Result'

const routes = [
  {
    path: "/",
    name: "Kbo",
    component: Kbo,
    meta: {
      title: baseName + ' - KBO'
    },
  },
  {
    path: "/nba",
    name: "Nba",
    component: Nba,
    meta: {
      title: baseName + ' - NBA'
    }
  }, 
  {
    path: '/lck',
    name: 'Lck',
    component: Lck,
    meta: {
      title: baseName + ' - LCK'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to) => {
  const title = to.meta.title ===  undefined ? baseName : to.meta.title
  nextTick(() => {
    document.title = title
  })
})

export default router;
