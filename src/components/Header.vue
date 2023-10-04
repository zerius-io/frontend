<template>
    <div class="flex header">
        <router-link to="/">
            <img class="logo" alt="logo" :src="logoImg">
        </router-link>

        <div style="display: flex;">
            <router-link to="/" class="nav">
                <h3>Mint</h3>
            </router-link>
            <router-link to="/leaderboard" :class="{ active: $route.path === '/leaderboard' }" class="nav"
                style="position: relative;">
                <h3>Leaderboard <span class="soon-tip">soon</span></h3>
            </router-link>
        </div>

        <WalletConnector />
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

import WalletConnector from './WalletConnector.vue'

import logoImg from '/img/logo.svg'

import { useRoute } from 'vue-router'

const $route = useRoute()

export default defineComponent({
    name: 'Header-component',
    components: {
        WalletConnector,
    },
    data() {
        return {
            logoImg: logoImg
        }
    }
})
</script>
  
<style lang="scss">
$medium: 1500px;
$small: 1050px;

.header {
    margin: 1.5rem 0;

    .logo {
        width: 12.80719rem;
        height: 3.0045rem;

        transition: .3s;

        &:hover {
            transform: scale(1.1);
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
        padding: 0 4rem;
    }

    @media screen and (max-width: $small) {
        .nav {
            display: none;
        }
    }
}
</style>
