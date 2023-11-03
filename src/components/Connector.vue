<script setup>
import { ref, computed, onMounted, onBeforeUnmount, toRaw, watchEffect, watch } from 'vue'

import { useModal, ModalsContainer } from 'vue-final-modal'

import { init } from '@web3-onboard/vue'
import { useOnboard } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'

import store from '@/store'

import WalletControl from '@/controllers/walletControl'
import Config from '@/controllers/config'
import Evm from '@/controllers/evm'
import Starknet from '@/controllers/starknet'

import CustomSelect from "./Select.vue"
import Modal from '@/components/Modal.vue'

// EVM
const injected = injectedModule()
const web3Onboard = init({
    wallets: [injected],
    chains: Config.chainsConnect,
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

onMounted(() => [
    // Starknet
    Starknet.connect()
])

const chains = Config.chains

const selectedChain = ref(null)
const selectedChainRef = ref(null)
const walletConnectRef = computed(() => store.state.evm.walletConnectRef)

store.commit('evm/setSelectedChain', selectedChainRef.value?.selected)
store.commit('evm/setWalletConnectRef', walletConnectRef.value)

const toggleWallet = async () => Evm.toggleWallet()
const setChainById = () => Evm.setChainById()
const formatAddress = (address) => Evm.formatAddress(address)

watch(selectedChainRef, (newValue, oldValue) => {
    store.commit('evm/setSelectedChain', newValue?.selected)
    setChainById()
})

onMounted(() => {
    store.commit('evm/setOverwriteChain', true)
})

// MODAL
const modalOptions = {
    walletConnect: true,
    onConfirm() {
        close()
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
</script>

<template>
    <div style="display: flex; justify-content: space-between;">
        <custom-select ref="selectedChainRef" :options="chains" v-model="selectedChain" @change="setChainById" />

        <button type="button" @click="open" :class="connectedWallet ? 'button' : 'button__full'">
            {{ connectedWallet ? formatAddress(connectedWallet?.accounts[0]?.address) : walletConnectRef ?
                'Connecting...' : 'Connect wallet'
            }}
        </button>

        <ModalsContainer />
    </div>
</template>

<style lang="scss">
.modal-content {
    margin: 0 auto;

    button {
        min-width: 16rem;
        justify-content: center;
    }
}
</style>