<template>
    <h1 style="max-width: 60%;">Mint NFTs and collect it in one place via LayerZero technologies</h1>

    <Carousel />

    <button @click="mintNFT" :disabled="minting" class="button__full-uppercase"
        style="margin-top: 1rem; width: 15rem; height: 3rem;">
        {{ minting ? 'minting' : 'mint' }}
        <Spinner v-if="minting" />
    </button>

    <Collection />
</template>
  
<script setup>
import { ref, computed } from 'vue'
import { ethers } from 'ethers'

import store from '@/stores/store'

import Evm from '../components/evm'

import Zerius from '../components/config'

import Carousel from '../components/Carousel.vue'
import Spinner from '../components/Spinner.vue'
import Collection from '../components/Collection.vue'

import ABI from '@/assets/ABI.json'

const minting = ref(false)

const connectingWallet = computed(() => store.getters.getConnectedWallet())

const connectedWallet = computed(() => store.getters.getConnectedWallet())
const selectedChain = computed(() => store.getters.getSelectedChain())

const toogleWallet = computed(async () => await Evm.toggleWallet(connectingWallet, selectedChain))

async function mintNFT() {
    try {
        const contractAddress = Zerius.getContractForChain(selectedChain.value.id)

        if (!window.ethereum || !connectingWallet.label || !contractAddress) return
        const web3 = window.ethereum
        console.log(web3)

        minting.value = true

        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        console.log("Account:", await signer.getAddress())

        const contract = new ethers.Contract(contractAddress, ABI, signer)

        const transaction = await contract.mint()
        const receipt = await transaction.wait()

        console.log('Minting successful:', receipt)

        minting.value = false
    } catch (error) {
        console.error('Error minting NFT:', error)
        minting.value = false
    }
}
</script>