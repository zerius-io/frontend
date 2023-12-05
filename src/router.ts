import { createRouter, createWebHistory } from 'vue-router'
import { ref } from 'vue'

import Mint from '@/views/Mint.vue'
import Token from '@/views/Token.vue'
import Refuel from '@/views/Refuel.vue'
import Referral from '@/views/Referral.vue'
import Leaderboard from '@/views/Leaderboard.vue'

const refCode = ref('')

const routes = [
    { path: '/', component: Mint },
    { path: '/token', component: Token },
    { path: '/refuel', component: Refuel },
    { path: '/referral', component: Referral },
    { path: '/leaderboard', component: Leaderboard },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

function addRefToRoute(route, refFromStorage) {
    if (refFromStorage) {
        return {
            ...route,
            query: { ...route.query, ref: refFromStorage }
        }
    }
    return route
}

router.beforeEach((to, from, next) => {
    try {
        const refFromStorage = localStorage.getItem('refCode')
        const refCode = to.query.ref

        if (refCode && refCode !== refFromStorage) {
            localStorage.setItem('refCode', refCode)
        }

        if (!refFromStorage || to.query.ref) {
            next()
        } else {
            next({ ...to, query: { ...to.query, ref: refFromStorage } })
        }
    } catch (error) {
        next()
    }
})

export default router