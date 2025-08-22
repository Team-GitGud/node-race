import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QuestionView from '../views/QuestionView.vue'
import HostView from '../views/HostView.vue'
import JoinView from '../views/JoinView.vue'
import QuestionNavigationView from '@/views/QuestionNavigationView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'

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
  },
  {
    path: '/host',
    name: 'host',
    component: HostView
  },
  {
    path: '/join',
    name: 'join',
    component: JoinView
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: LeaderboardView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
