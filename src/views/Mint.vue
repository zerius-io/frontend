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
  
<script lang="ts">
import { defineComponent } from 'vue'
import { ethers } from 'ethers'

import ABI from '@/assets/ABI.json'

import Carousel from '../components/Carousel.vue'
import Spinner from '../components/Spinner.vue'
import Collection from '../components/Collection.vue'

export default defineComponent({
    name: 'Mint',
    components: {
        Carousel,
        Spinner,
        Collection
    },
    data() {
        return {
            minting: false,
        }
    },
    methods: {
        async mintNFT() {
            try {
                // Check if the user has MetaMask or another Ethereum provider installed
                if (window.ethereum) {
                    this.minting = true

                    const provider = new ethers.providers.Web3Provider(window.ethereum)
                    const signer = provider.getSigner()

                    // Replace 'yourContractABI' and 'yourContractAddress' with your actual ABI and address
                    const contractAddress = '0x...'

                    // Create contract instance
                    const contract = new ethers.Contract(contractAddress, ABI, signer)

                    // Replace 'mint' with the actual name of your mint function and provide required parameters
                    const transaction = await contract.mint()

                    // Wait for the transaction to be mined
                    const receipt = await transaction.wait()

                    console.log('Minting successful:', receipt)

                    this.minting = false
                } else {
                    console.error('Ethereum provider not available')
                }
            } catch (error) {
                console.error('Error minting NFT:', error)
            }
        }
    }
})
</script>
  
<style lang="scss"></style>
  