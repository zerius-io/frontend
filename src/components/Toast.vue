<template>
    <div v-if="!explorer?.hash" class="toast-body">
        <span class="toast-info">{{ info }}</span>
        <div class="toast-date">less than 1 minute ago</div>
    </div>

    <a v-else class="toast-body" :href="url" target="_blank" rel="noopener noreferrer">
        <span class="toast-info">{{ info }}</span>

        <div class="toast-explorer">
            <span class="toast-explorer">View on explorer</span>
            <img alt="link" :src="linkImg" />
        </div>

        <div class="toast-date">less than 1 minute ago</div>
    </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Zerius from '../components/config'

import linkImg from '/img/link.svg'

const { info, explorer } = defineProps(['info', 'explorer'])

const url = computed(() => Zerius.getExplorerTxUrl(explorer))
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
