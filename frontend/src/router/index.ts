import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import QuestionView from '../views/QuestionView.vue';
import HostView from '../views/HostView.vue';
import QuestionNavigationView from '@/views/QuestionNavigationView.vue';
import PlayerLobbyView from '@/views/PlayerLobbyView.vue';
import LeaderboardView from '@/views/LeaderboardView.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'home',
		component: HomeView
	},
	{
		path: '/lobby',
		name: 'lobby',
		component: PlayerLobbyView
	},
	{
		path: '/question-navigation',
		name: 'question-navigation',
		component: QuestionNavigationView
	},
	{
		path: '/question/:questionIndex',
		name: 'question',
		component: QuestionView,
		props: (route) => ({
			questionIndex: Number(route.params.questionIndex) // We have to do this because it's a number. Otherwise it will crash.
		})
	},
	{
		path: '/host',
		name: 'host',
		component: HostView
	},
	{
		path: '/join',
		name: 'join',
		component: PlayerLobbyView
	},
	{
		path: '/leaderboard',
		name: 'leaderboard',
		component: LeaderboardView
	},
	{
		path: '/:pathMatch(.*)*',
		redirect: { name: 'home' }
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
});

export default router;