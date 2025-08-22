import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuestionView from '../views/QuestionView.vue'
import HostView from '../views/HostView.vue'
import QuestionNavigationView from '@/views/QuestionNavigationView.vue'
import PlayerLobbyView from '@/views/PlayerLobbyView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/lobby',
    name: 'lobby',
    component: PlayerLobbyView,
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
  },
  {
    path: '/host',
    name: 'host',
    component: HostView
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
