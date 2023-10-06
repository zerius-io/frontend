<template>
    <h1 style="max-width: 60%;">Mint NFTs and collect it in one place via LayerZero technologies</h1>

    <Carousel />

    <button @click="mintNFT" :disabled="minting" class="button__full-uppercase"
        style="margin-top: 1rem; width: 15rem; height: 3rem;">
        {{ minting ? 'minting' : 'mint' }}
        <Spinner v-if="minting" />
    </button>

    <div v-if="connectedWallet">
        Connected Wallet: {{ connectedWallet?.accounts[0]?.address }}
    </div>
    <!-- <div v-if="selectedChain">
        Connected Chain: {{ selectedChain }}
    </div> -->

    <Collection />
</template>
  
<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { ethers } from 'ethers'

import store from '@/stores/store';

import Zerius from '../components/config'

import Carousel from '../components/Carousel.vue'
import Spinner from '../components/Spinner.vue'
import Collection from '../components/Collection.vue'

import ABI from '@/assets/ABI.json'

export default defineComponent({
    name: 'Mint',
    components: {
        Carousel,
        Spinner,
        Collection
    },
    setup() {
        const minting = ref(false);

        async function mintNFT() {
            try {
                minting.value = true;

                if (window.ethereum) {
                    const web3 = window.ethereum

                    const CHAIN = {
                        id: 80001,
                        token: 'MATIC',
                        label: 'Mumbai',
                        rpcUrl: 'https://polygon-mumbai-bor.publicnode.com',
                        icon: 'polygon.svg'
                    }

                    console.log(web3)

                    const provider = new ethers.BrowserProvider(window.ethereum)
                    // It will prompt user for account connections if it isnt connected
                    const signer = await provider.getSigner();
                    console.log("Account:", await signer.getAddress())

                    // const provider = new ethers.JsonRpcProvider(web3);
                    // const contractAddress = Zerius.getContractForChain(selectedChain.id);
                    const contractAddress = Zerius.getContractForChain(CHAIN.id);
                    const contract = new ethers.Contract(contractAddress, ABI, signer);

                    const transaction = await contract.mint()
                    const receipt = await transaction.wait()

                    console.log('Minting successful:', receipt);

                    minting.value = false;
                } else {
                    console.error('Ethereum provider not available');
                }
            } catch (error) {
                console.error('Error minting NFT:', error);
                minting.value = false;
            }
        }

        return {
            minting,
            mintNFT,
            connectedWallet: computed(() => store.getters.getConnectedWallet()),
            selectedChain: computed(() => store.getters.getSelectedChain()),
        };
    }
})
</script>
  
<style lang="scss"></style>
