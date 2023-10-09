<script setup lang="ts">
import { ref } from 'vue'

import { VueFinalModal } from 'vue-final-modal'

import Evm from './evm'
import Zerius from './config'

import CustomSelect from "./Select.vue"
import Collectable from './Collectable.vue'

defineProps<{
    title?: string,
    collectable?: any
}>()

const emit = defineEmits<{
    (e: 'confirm'): void
}>()

const selectedChain = ref(null)
const selectedChainRef = ref(null)

const setChainById = () => Evm.setChainById(selectedChainRef.value.selected)

</script>

<template>
    <VueFinalModal class="modal flex" content-class="modal-content" overlay-transition="vfm-fade"
        content-transition="vfm-fade">

        <h1>{{ title }}</h1>

        <custom-select v-if="title === 'Bridge'" ref="selectedChainRef" :options="Zerius.chains" v-model="selectedChain"
            @change="setChainById" :initialChainId="collectable.chainId" />

        <slot />

        <Collectable :item="collectable" :clickable="false" />

        <button v-if="title === 'Bridge'" class="button__full">
            Send
        </button>

        <!-- <button @click="emit('confirm')" class="button_full">
            Confirm
        </button> -->
    </VueFinalModal>
</template>

<style lang="scss">
.modal {
    display: flex;
    justify-content: center;
    align-items: center;

    &-content {
        display: flex;
        flex-direction: column;

        padding: 1rem 1.5rem;

        background: #fff;
        border-radius: 0.5rem;

        &->*+* {
            margin: 0.5rem 0;
        }

        h1 {
            color: var(--dark, #18181B);

            font-size: 1.125rem;
            font-style: normal;
            font-weight: 600;

            line-height: 80%;
        }

        button {
            margin: 1rem auto;
            padding: 0.5rem 1.5rem;

            width: 12.5rem;
            height: 3rem;
            // padding: 0 8px;
            // border: 1px solid;
            // border-radius: 0.5rem;
        }
    }
}
</style>
