import { createRouter, createWebHistory } from 'vue-router'

import Mint from '@/views/Mint.vue'
import Token from '@/views/Token.vue'
import Refuel from '@/views/Refuel.vue'
import Leaderboard from '@/views/Leaderboard.vue'

const routes = [
    { path: '/', component: Mint },
    { path: '/token', component: Token },
    { path: '/refuel', component: Refuel },
    { path: '/leaderboard', component: Leaderboard },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
