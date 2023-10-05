<template>
    <div class="flex header">
        <router-link to="/">
            <img class="logo" alt="logo" :src="logoImg">
        </router-link>

        <div style="display: flex;">
            <router-link to="/" :class="{ active: route.path === '/leaderboard' }" class="nav">
                <h3>Mint</h3>
            </router-link>
            <span to="/leaderboard" :class="{ active: route.path === '/leaderboard' }"
                style="position: relative; cursor: pointer">
                <h3>Leaderboard <span class="soon-tip">soon</span></h3>
            </span>
        </div>

        <WalletConnector />
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import WalletConnector from './WalletConnector.vue'

import logoImg from '/img/logo.svg'

import { useRoute } from 'vue-router'

export default defineComponent({
    name: 'Header-component',
    components: {
        WalletConnector,
    },
    data() {
        return {
            logoImg: logoImg
        }
    },
    setup() {
        const route = useRoute()
        const logoImgSrc = ref(logoImg)

        return {
            route,
            logoImg: logoImgSrc,
        };
    },
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
