import { createRouter, createWebHistory } from 'vue-router'
import Mint from './views/Mint.vue'
import Leaderboard from './views/Leaderboard.vue'

const routes = [
    { path: '/', component: Mint },
    { path: '/leaderboard', component: Leaderboard },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
