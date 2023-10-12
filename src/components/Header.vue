<template>
    <div class="flex header">
        <router-link to="/">
            <div class=flex logo>
                <img class="logo-icon" alt="logo" :src="logoImg" />
                <img class="logo-text" alt="logo" :src="logoTextImg" />
            </div>
        </router-link>

        <div style="display: flex;">
            <router-link to="/" :class="{ active: route.path === '/leaderboard' }" class="nav">
                <h3>Mint & Bridge</h3>
            </router-link>
            <span to="/leaderboard" :class="{ active: route.path === '/leaderboard' }" style="position: relative">
                <h3>Leaderboard <span class="soon-tip">soon</span></h3>
            </span>
        </div>

        <WalletConnector />
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import WalletConnector from './WalletConnector.vue'

import logoImg from '/img/logo.svg'
import logoTextImg from '/img/logo_text.svg'

const route = useRoute()

</script>
  
<style lang="scss">
$medium: 1500px;
$small: 1050px;

.header {
    margin: 1.5rem 0;

    flex-wrap: wrap;

    .logo {
        transition: .3s;

        &:hover {
            transform: scale(1.1);
        }

        &-icon {
            width: 3.75rem;
            height: 3.875rem;
        }

        &-text {
            // width: 9.5625rem;
            // height: 2.4375rem;
        }
    }

    .nav {
        margin: 0 2rem;
        transition: .3s;

        &:hover {
            color: var(--blue, #2C6EFF);
        }
    }

    @media screen and (max-width: $medium) {
        padding: 0 1rem;
    }

    @media screen and (max-width: $small) {
        .logo {
            width: 7rem;
            height: 2rem;
        }

        .nav {
            display: none;
        }

        span {
            display: none;
        }
    }
}
</style>
  