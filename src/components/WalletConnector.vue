<script setup>
import { ref, computed, onMounted, onBeforeUnmount, toRaw, watchEffect, watch } from 'vue'

import { init } from '@web3-onboard/vue'
import { useOnboard } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'

import store from '@/store'

import Evm from './evm'
import Zerius from './config'

import CustomSelect from "./Select.vue"

const injected = injectedModule()
const web3Onboard = init({
    wallets: [injected],
    chains: Zerius.chains,
    accountCenter: {
        desktop: {
            enabled: false,
            minimal: true
        },
        mobile: {
            enabled: false,
            minimal: true
        }
    },
    connect: {
        autoConnectLastWallet: true
    }
})

const {
    connectWallet,
    connectedWallet,
    alreadyConnectedWallets,
    disconnectConnectedWallet,
    switchChain,
    connect,
    disconnect,
    setChain
} = useOnboard()

const chains = Zerius.chains

const selectedChain = ref(null)
const selectedChainRef = ref(null)
const walletConnectRef = computed(() => store.state.wallet.walletConnectRef)

store.commit('wallet/setSelectedChain', selectedChainRef.value?.selected)
store.commit('wallet/setWalletConnectRef', walletConnectRef.value)

const toggleWallet = async () => Evm.toggleWallet()
const setChainById = () => Evm.setChainById()
const formatAddress = (address) => Evm.formatAddress(address)

watch(selectedChainRef, (newValue, oldValue) => {
    store.commit('wallet/setSelectedChain', newValue?.selected)
    setChainById()
})

onMounted(() => {
    store.commit('wallet/setOverwriteChain', true)
})
</script>

<template>
    <div style="display: flex; justify-content: space-between;">
        <custom-select ref="selectedChainRef" :options="chains" v-model="selectedChain" @change="setChainById" />

        <button type="button" @click="toggleWallet" :class="connectedWallet ? 'button' : 'button__full'">
            {{ connectedWallet ? formatAddress(connectedWallet?.accounts[0]?.address) : walletConnectRef ?
                'Connecting...' : 'Connect wallet'
            }}
        </button>
    </div>
</template>