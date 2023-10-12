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
  
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ModalsContainer, useModal } from 'vue-final-modal'
import { useToast } from 'vue-toastification'

import store from '@/store'

import Evm from '../components/evm'

import Carousel from '../components/Carousel.vue'
import Spinner from '../components/Spinner.vue'
import Collection from '../components/Collection.vue'
import Modal from '../components/Modal.vue'
import Toast from '../components/Toast.vue'

const minting = ref(false)
const connectedWallet = computed(() => store.getters['wallet/connectedWallet'])
const selectedChain = computed(() => store.getters['wallet/selectedChain'])

let item = null

const { open, close } = useModal({
    component: Modal,
    attrs: {
        title: 'Yay, congratulations!',
        collectable: item,
        onConfirm() {
            mint()
        },
    },
    slots: {},
})

const toast = useToast()
const showToast = (info, explorer = null) => toast({
    component: Toast,
    props: {
        info,
        explorer
    }
})

async function mint() {
    const chainId = selectedChain?.value?.id

    minting.value = true
    showToast("Minting..")

    const { result, msg, receipt } = await Evm.mint()

    minting.value = false
    showToast(msg, { id: chainId, hash: receipt?.hash })

    if (result) {
        let itemId = receipt?.logs?.[0]?.topics?.[3]
        console.log(itemId)

        itemId = BigInt(itemId) || null
        console.log(itemId)

        if (itemId) {
            item = { chainId: chainId, id: Number(itemId), uri: await Evm.getUri(chainId, itemId, receipt?.hash) }
            console.log(item)

            open()
        }
    }
}
</script>