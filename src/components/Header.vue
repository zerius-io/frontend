<template>
    <div class="flex header">
        <router-link to="/" class="header-left">
            <div class=flex logo>
                <img class="logo-icon" alt="logo" :src="logoImg" />
                <img class="logo-text" alt="logo" :src="logoTextImg" />
            </div>
        </router-link>

        <div class="header-center" style="display: flex;">
            <router-link to="/" :class="{ active: route.path === '/leaderboard' }" class="nav">
                <h3>Mint & Bridge</h3>
            </router-link>
            <span to="/leaderboard" :class="{ active: route.path === '/leaderboard' }" style="position: relative">
                <h3>Leaderboard <span class="soon-tip">soon</span></h3>
            </span>
        </div>

        <WalletConnector class="header-right" />
    </div>
</template>
  
<script setup>
import { useRoute } from 'vue-router'

import WalletConnector from './WalletConnector.vue'

import logoImg from '/img/logo.svg'
import logoTextImg from '/img/logo_text.png'

const route = useRoute()

</script>
  
<style lang="scss">
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
            margin: 0 .5rem;
            width: 9rem;
            height: auto;
        }
    }

    .nav {
        margin: 0 2rem;
        transition: .3s;

        &:hover {
            color: var(--blue, #2C6EFF);
        }
    }

    @media screen and (max-width: 1500px) {
        padding: 0 4rem;
    }

    @media screen and (max-width: 1050px) {
        padding: 0 1rem;

        flex-direction: column;

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

        &-right {
            margin-top: .8rem;

            .select {
                margin-right: 1rem;
            }

            .button {
                padding: .4rem;
                height: 2.1rem;
            }
        }
    }
}
</style>
  