<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ethers } from 'ethers'

import store from '@/store'

import Collectable from './Collectable.vue'

import Zerius from './config'
import Evm from './evm'

import ABI from '@/assets/ABI.json'

const collection = ref([])

const connectedWallet = computed(() => store.getters['wallet/connectedWallet'])

onMounted(async () => {
    await fetchCollection()
})

watch(connectedWallet, async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) await fetchCollection()
})

const fetchWithRetry = async (fetchFunction, maxRetries = 3, delay = 1000) => {
    let retries = 0
    while (retries < maxRetries) {
        try {
            return await fetchFunction();
        } catch (error) {
            // console.error('Error:', error)
            await new Promise(resolve => setTimeout(resolve, delay))
            retries++
        }
    }
}

const fetchCollection = async () => {
    try {
        if (!window.ethereum || !Evm.isWalletConnected) return
        const web3 = window.ethereum

        const provider = new ethers.BrowserProvider(web3)
        const signer = await provider.getSigner()
        const owner = await signer.getAddress()

        const ITEMS = []

        for (const [chainId, contractAddress] of Object.entries(Zerius.getAllContracts())) {
            const contract = new ethers.Contract(contractAddress, ABI, signer)

            const tokensCount = Number(await contract.balanceOf(owner))

            const chainItems = []
            for (let i = 0; i < tokensCount; i++) {
                const fetchFunction = async () => {
                    const id = Number(await contract.tokenOfOwnerByIndex(owner, i))
                    const uri = await contract.tokenURI(id)
                    return { chainId, id, uri }
                }

                try {
                    const result = await fetchWithRetry(fetchFunction, 3, 1000)
                    chainItems.push(result);
                } catch (error) {
                    // console.error('Error fetching item:', error)
                }
            }

            if (chainItems.length) ITEMS.push(chainItems)
        }

        collection.value = ITEMS.flat().sort((a, b) => a.id - b.id)
    } catch (error) {
        // console.error('Error fetching collection:', error)
    }
}
</script>

<template>
    <div style="margin: 2.8rem auto; margin-top: 3.5rem">
        <!-- <h1>Your collection{{ collection.length ? '' : ' will be here' }}</h1> -->

        <div class="flex collectables">
            <Collectable v-for="item in collection" :key="item.id" :item="item" :clickable="true" />
        </div>
    </div>
</template>

<style lang="scss">
h1 {
    margin: 2rem auto;
}
</style>