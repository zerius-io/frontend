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
import { useModal } from 'vue-final-modal'
import { useToast } from 'vue-toastification'

import store from '@/store'

import Evm from '@/components/evm'

import Carousel from '@/components/Carousel.vue'
import Collection from '@/components/Collection.vue'
import Spinner from '@/components/Spinner.vue'
import Modal from '@/components/Modal.vue'
import Toast from '@/components/Toast.vue'
import Zerius from '@/components/config'

const minting = ref(false)
const selectedChain = computed(() => store.getters['wallet/selectedChain'])

let item = null

const modalOptions = {
    title: 'Yay, congratulations!',
    collectable: item,
    onConfirm() {
        mint()
    }
}

const { open, close, patchOptions } = useModal({
    component: Modal,
    attrs: modalOptions,
    slots: {},
})

patchOptions({
    attrs: {
        ...modalOptions,
        close
    }
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
    const { result, msg, receipt } = await Evm.mint(showToast)

    minting.value = false
    showToast(msg, { id: chainId, hash: receipt?.hash })

    if (result) {
        let itemId = (chainId != 137) ?
            receipt?.logs?.[0]?.topics?.[3] : receipt?.logs?.[1].topics?.[3]

        itemId = BigInt(itemId) || null

        if (itemId) {
            item = { chainId: chainId, id: Number(itemId), uri: Zerius.getIpfsUri(itemId) }

            patchOptions({
                attrs: {
                    title: 'Yay, congratulations!',
                    collectable: item,
                    close,
                    onConfirm() {
                        mint()
                    }
                }
            })

            open()

            store.commit('wallet/setCollection', true)
        }
    }
}
</script>