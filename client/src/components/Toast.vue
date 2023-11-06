<template>
    <div class="toast-body">
        <span class="toast-info">{{ info }}</span>

        <a v-if="explorer?.hash" :href="url" target="_blank" rel="noopener noreferrer">
            <div class="toast-explorer">
                <span class="toast-explorer">View on explorer</span>
                <img alt="link" :src="linkImg" />
            </div>
        </a>

        <div class="toast-date">{{ timeMessage }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Config from '@/controllers/config'

import linkImg from '/img/link.svg'

// Time
const creationTime = ref(Date.now())

const timeDifference = computed(() => {
    const now = Date.now()
    const diffInMilliseconds = now - creationTime.value
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    return diffInMinutes
})

const timeMessage = computed(() => {
    if (timeDifference.value < 1) {
        return 'less than 1 minute ago'
    } else {
        return `${timeDifference.value} minutes ago`
    }
})

// Explorer
const { info, explorer } = defineProps(['info', 'explorer'])

const url = computed(() => Config.getExplorerTxUrl(explorer))
</script>

<style lang="scss">
.toast {
    min-width: 13rem;

    min-height: 2rem;
    height: auto;

    padding: 0;

    text-align: left;

    border-radius: 0.75rem;
    background: var(--light, #FBFBFB);
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);

    letter-spacing: -0.0175rem;

    &-body {
        padding: 0.5rem 1rem;
        padding-left: .6rem;
        padding-right: 1.5rem;

        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: flex-start;

        color: var(--dark, #18181B);
        font-size: 1.125rem;
        font-weight: 500;
    }

    &-info {
        margin: .25rem 0;
    }

    &-explorer {
        margin: .5rem 0;
        margin-bottom: .2rem;

        font-size: 0.875rem;
        font-weight: 400;
        letter-spacing: -0.0175rem;

        span {
            margin-right: .5rem;
        }
    }

    &-date {
        color: var(--gray, #A1A1A9);
        font-size: 0.875rem;
        font-weight: 400;
    }

    .Vue-Toastification__close-button {
        position: absolute;
        top: 0;
        right: 0;

        width: 2rem;

        padding: .5rem;
        padding-right: 2rem;

        color: var(--dark, #18181B);
    }
}
</style>
