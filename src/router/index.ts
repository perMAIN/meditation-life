import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/meditation',
      name: 'meditation',
      // 使用懒加载以提高首页加载速度
      component: () => import('../views/MeditationView.vue')
    }
  ],
})

export default router
