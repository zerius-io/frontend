<template>
    <div class="flex header footer">
        <a :href="lzLink" target="_blank" rel="noopener noreferrer">
            <img class="logo" alt="lz" :src="logoLz">
        </a>

        <div>
            <a :href="githubLink" target="_blank" rel="noopener noreferrer">
                <img class="icon" alt="github" :src="iconGitHub">
            </a>
            <a :href="twitterLink" target="_blank" rel="noopener noreferrer">
                <img class="icon" alt="twitter" :src="iconTwitter">
            </a>
            <a :href="telegramLink" target="_blank" rel="noopener noreferrer">
                <img class="icon" alt="telegram" :src="iconTelegram">
            </a>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';

import logoLz from '/img/footer/lz.svg'

import iconGitHub from '/img/footer/github.png'
import iconTwitter from '/img/footer/twitter.svg'
import iconTelegram from '/img/footer/telegram.png'

export default defineComponent({
    name: 'Footer-component',
    components: {
    },
    data() {
        return {
            logoLz,
            iconGitHub,
            iconTwitter,
            iconTelegram,
            lzLink: 'https://layerzero.network/',
            githubLink: 'https://github.com/ifrosta',
            twitterLink: 'https://twitter.com/',
            telegramLink: 'https://t.me/'
        }
    }
})
</script>
  
<style lang="scss">
.footer {
    bottom: 0;

    .icon {
        margin: 0 1.5rem;

        width: 2.25rem;
        height: 2.25rem;
    }
}
</style>
