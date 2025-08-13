import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuestionView from '../views/QuestionView.vue'
import QuestionNavigationView from '@/views/QuestionNavigationView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/question-navigation',
    name: 'question-navigation',
    component: QuestionNavigationView,
  },
  {
    path: '/question',
    name: 'question',
    component: QuestionView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
