import { createRouter, createWebHistory }  from 'vue-router'
import Main from './pages/Main.vue'
import NewId from './pages/NewId.vue'

const routes = [
	{
		path: '/',
		name: 'Main',
		component: Main
	},
	{
		path: '/news/:id',
		name: 'news_id',
		component: NewId,
		props: true
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router