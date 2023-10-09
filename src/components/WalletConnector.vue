<template>
    <div style="display: flex; justify-content: space-between;">
        <custom-select ref="selectedChainRef" :options="chains" v-model="selectedChain" @change="setChainById" />

        <button type="button" @click="toggleWallet" :class="connectedWallet ? 'button' : 'button__full'">
            {{ connectedWallet ? formatAddress(connectedWallet?.accounts[0]?.address) : connectingWallet ?
                'Connecting...' : 'Connect wallet'
            }}
        </button>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted, onBeforeUnmount, toRaw } from 'vue'

import CustomSelect from "./Select.vue"

import { init } from '@web3-onboard/vue'
import { useOnboard } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'

import store from '@/store'

import Evm from './evm'
import Zerius from './config'

const injected = injectedModule()
const web3Onboard = init({
    wallets: [injected],
    chains: Zerius.chains
})

const {
    connectWallet,
    connectedWallet,
    disconnectConnectedWallet,
    switchChain,
    connect,
    disconnect,
    setChain
} = useOnboard()

const chains = Zerius.chains

const connectingWallet = ref(false)
const selectedChain = ref(null)
const selectedChainRef = ref(null)

const toggleWallet = async () => Evm.toggleWallet(connectingWallet, selectedChainRef.value.selected)

const setSwitchChain = () => Evm.switchChain(selectedChainRef.value.selected)
const setChainById = () => Evm.setChainById(selectedChainRef.value.selected)

const formatAddress = (address) => Evm.formatAddress(address)

</script>