<script setup lang="ts">
import { ref, computed } from 'vue'
import { useModal } from 'vue-final-modal'
import { useToast } from 'vue-toastification'

import store from '@/store'

import Carousel from '@/components/Carousel.vue'
import Collection from '@/components/Collection.vue'
import Spinner from '@/components/Spinner.vue'
import Modal from '@/components/Modal.vue'
import Toast from '@/components/Toast.vue'

import Config from '@/controllers/config'
import Evm from '@/controllers/evm'
import Starknet from '@/controllers/starknet'

const minting = ref(false)
const selectedChain = computed(() => store.getters['evm/selectedChain'])

let item = null

const modalOptions = {
    walletConnect: false,
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

function isStarknet() {
    return selectedChain.value.label === 'Starknet'
}

async function mint() {
    const chainId = selectedChain?.value?.id

    minting.value = true
    const { result, msg, receipt } = isStarknet() ? await Starknet.mint(showToast) : await Evm.mint(showToast)

    minting.value = false
    showToast(msg, { id: chainId, hash: receipt?.hash })

    if (result) {
        let itemId = !isStarknet() ?
            extractItemId(receipt, chainId) :
            extractItemIdStarknet(receipt)

        if (!itemId && !isStarknet()) {
            itemId = await waitForItemId(receipt.hash, chainId, 5)
        }

        if (itemId) {
            item = {
                chainId: chainId,
                id: Number(itemId),
                uri: Config.getIpfsUri(Number(itemId))
            }

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

            store.commit('evm/setCollection', item)
        }
    }
}

function extractItemId(receipt: { logs: { topics: any[] }[] }, chainId: number) {
    let itemId = (chainId != 137) ?
        receipt?.logs?.[0]?.topics?.[3] : receipt?.logs?.[1]?.topics?.[3]

    return itemId ? BigInt(itemId) : null
}

function extractItemIdStarknet(receipt: { events: { data: string[] }[] }) {
    let itemId = receipt?.events?.[2]?.data?.[2]
    return itemId ? BigInt(itemId) : null
}

async function waitForItemId(txHash: string, chainId: number, retries: number): Promise<bigint> {
    return new Promise(async (resolve) => {
        if (retries <= 0) {
            resolve(null)
            return
        }

        setTimeout(async () => {
            const receipt = await Evm.getReceipt(txHash)
            const itemId = extractItemId(receipt, chainId)

            if (itemId) {
                resolve(itemId)
            } else {
                resolve(await waitForItemId(txHash, chainId, retries - 1))
            }
        }, 5000)
    })
}
</script>

<template>
    <h1 style="max-width: 60%;">Mint NFTs and send them via LayerZero</h1>

    <Carousel />

    <!-- :class="{ 'button__full-starknet': 'isStarknet' }" -->
    <button @click="mint" :disabled="minting" class="button__full-uppercase"
        style="margin-top: 1rem; width: 15rem; height: 3rem;">
        {{ minting ? 'minting' : 'mint' }}
        <Spinner v-if="minting" />
    </button>

    <Collection />
</template>