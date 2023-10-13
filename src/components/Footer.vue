<template>
    <div class="flex header footer">
        <a :href="lzLink" target="_blank" rel="noopener noreferrer">
            <img class="logo" alt="lz" :src="logoLz" />
        </a>

        <div>
            <a :href="githubLink" target="_blank" rel="noopener noreferrer">
                <img class="icon" alt="github" :src="iconGitHub" />
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
  
<script setup>
import logoLz from '/img/footer/lz.svg'
import iconGitHub from '/img/footer/github.png'
import iconTwitter from '/img/footer/twitter.svg'
import iconTelegram from '/img/footer/telegram.png'

const lzLink = 'https://layerzero.network/'
const githubLink = 'https://medium.com/@zerius.io'
const twitterLink = 'https://twitter.com/Zerius_io'
const telegramLink = 'https://t.me/zerius_io'

const logoLzSrc = logoLz
const iconGitHubSrc = iconGitHub
const iconTwitterSrc = iconTwitter
const iconTelegramSrc = iconTelegram;

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

    @media screen and (max-width: $small) {
        flex-direction: column-reverse;

        .icon {
            margin: 1.5rem 2rem;
        }
    }
}
</style>