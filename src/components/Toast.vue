<template>
    <div class="toast-body">
        <span class="toast-info">{{ info }}</span>
        <a v-if="explorer" class="toast-explorer" :href="url" target="_blank" rel="noopener noreferrer">
            <span>View on explorer</span>
            <img alt="link" :src="linkImg" />
        </a>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Zerius from '../components/config'

import linkImg from '/img/link.svg'

const { info, id, explorer } = defineProps(['info', 'explorer'])

const url = computed(() => Zerius.getExplorerTxUrl(explorer))
</script>

<style lang="scss">
.toast {
    min-width: 15rem;
    width: 16rem;

    min-height: 2rem;
    height: auto;

    padding: 0;

    border-radius: 0.75rem;
    background: var(--light, #FBFBFB);
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);

    &-body {
        padding: 0.5rem 0.6rem;

        display: flex;
        flex-direction: column;
        justify-items: center;
        align-items: flex-start;

        color: var(--dark, #18181B);
        font-size: 1.125rem;
        font-weight: 600;
    }

    &-info {
        margin: .25rem 0;
    }

    &-explorer {
        margin: .5rem 0;

        font-size: 0.875rem;
        font-weight: 400;
        letter-spacing: -0.0175rem;

        span {
            margin-right: .5rem;
        }
    }
}
</style>
