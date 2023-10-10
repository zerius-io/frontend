<template>
    <h1 style="max-width: 60%;">Mint NFTs and send them via LayerZero</h1>

    <Carousel />

    <button @click="mint" :disabled="minting" class="button__full-uppercase"
        style="margin-top: 1rem; width: 15rem; height: 3rem;">
        {{ minting ? 'minting' : 'mint' }}
        <Spinner v-if="minting" />
    </button>

    <Collection />
</template>
  
<script setup>
import { ref, computed } from 'vue'
import { ModalsContainer, useModal } from 'vue-final-modal'

import store from '@/store'

import Evm from '../components/evm'
import Zerius from '../components/config'

import Carousel from '../components/Carousel.vue'
import Spinner from '../components/Spinner.vue'
import Collection from '../components/Collection.vue'
import Modal from '../components/Modal.vue'

const minting = ref(false)

// const connectedWallet = computed(() => store.getters['wallet/connectedWallet'])
const selectedChain = computed(() => store.getters['wallet/selectedChain'])

const toogleWallet = computed(async () => await Evm.toggleWallet(connectedWallet, selectedChain))

const { open, close } = useModal({
    component: Modal,
    attrs: {
        title: 'Yay, congratulations!',
        // collectable: props.item,
        onConfirm() {
            mint()
        },
    },
    slots: {
        // default: '<p>The content of the modal</p>',
    },
})

async function mint() {
    minting.value = true

    minting.value = await Evm.mint()
    if (minting.value) open()
}
</script>