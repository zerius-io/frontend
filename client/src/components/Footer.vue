<template>
    <div class="flex header footer">
        <a :href="lzLink" target="_blank" rel="noopener noreferrer">
            <img class="logo" alt="lz" :src="logoLz" />
        </a>

        <div>
            <a :href="gitBookLink" target="_blank" rel="noopener noreferrer">
                <img class="icon" alt="gitbook" :src="iconGitbook" />
            </a>
            <a :href="mediumLink" target="_blank" rel="noopener noreferrer">
                <img class="icon" alt="medium" :src="iconMedium" />
            </a>
            <a :href="twitterLink" target="_blank" rel="noopener noreferrer">
                <img class="icon" alt="twitter" :src="iconTwitter" />
            </a>
            <a :href="telegramLink" target="_blank" rel="noopener noreferrer">
                <img class="icon" alt="telegram" :src="iconTelegram" />
            </a>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import logoLz from '/img/footer/lz.svg'
import iconGitbook from '/img/footer/gitbook.png'
import iconMedium from '/img/footer/github.png'
import iconTwitter from '/img/footer/twitter.svg'
import iconTelegram from '/img/footer/telegram.png'

const lzLink = 'https://layerzero.network'
const gitBookLink = 'https://zerius.gitbook.io/zerius'
const mediumLink = 'https://medium.com/@zerius.io'
const twitterLink = 'https://twitter.com/Zerius_io'
const telegramLink = 'https://t.me/zerius_io'
</script>
  
<style lang="scss">
$small: 600px;

.footer {
    bottom: 0;

    .icon {
        margin: 0 1.5rem;
        width: 2.25rem;
        height: 2.25rem;
    }

    @media screen and (max-width: 1050px) {
        flex-direction: column-reverse;
    }

    @media screen and (max-width: $small) {
        .icon {
            margin: 1.5rem;
        }
    }

    @media screen and (max-width: 400px) {
        .icon {
            margin: 1rem;
        }
    }

    @media screen and (max-width: 350px) {
        .icon {
            margin: .8rem;
        }
    }
}
</style>