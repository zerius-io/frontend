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
    Starknet.toggleWallet()
])

const chains = Config.chains

const STARKNET_CHAIN_ID = 2344859429196833

const selectedChain = ref(null)
const selectedChainRef = ref(null)
const walletConnectRef = computed(() => store.state.evm.walletConnectRef)

const selectedChainValue = computed(() => store.getters['evm/selectedChain'])
// Evm
const isEvmWalletConnected = computed(() => Evm.isWalletConnected)
const evmConnectedWallet = computed(() => Evm.connectedWallet)
// Starknet
const isStarknetWalletConnected = computed(() => Starknet.isWalletConnected)
const starknetConnectedWallet = computed(() => Starknet.connectedWallet)


const isEvmWalletConnectedAndSelectedChain = computed(() => {
    return isEvmWalletConnected.value && selectedChainValue.value?.id != STARKNET_CHAIN_ID || null
})

const isStarknetWalletConnectedAndSelectedChain = computed(() => {
    return isStarknetWalletConnected.value && selectedChainValue.value?.id == STARKNET_CHAIN_ID
})

const buttonLabel = computed(() => {
    if (isEvmWalletConnectedAndSelectedChain.value) {
        return formatAddress(evmConnectedWallet.value?.accounts[0]?.address)
    } else if (isStarknetWalletConnectedAndSelectedChain.value) {
        return formatAddress(starknetConnectedWallet.value)
    } else if (walletConnectRef.value) {
        return 'Connecting...'
    } else {
        return 'Connect wallet'
    }
})

store.commit('evm/setSelectedChain', selectedChainRef.value?.selected)
store.commit('evm/setWalletConnectRef', walletConnectRef.value)

const toggleWallet = async () => Evm.toggleWallet()
const formatAddress = (address) => Evm.formatAddress(address)

// watch(selectedChainRef, (newValue, oldValue) => {
//     console.log('UP UP UP', newValue, oldValue)
//     store.commit('evm/setSelectedChain', newValue?.selected)
//     Evm.setChainById()
// })

watch(() => Evm.connectedWallet, async (newWallet, oldWallet) => {
    if (oldWallet === null) return

    if (newWallet?.chains?.[0]?.id !== oldWallet?.chains?.[0]?.id) {
        // console.log('CONNECTED WALLET', newWallet, oldWallet)
        Evm.setChainById(parseInt(newWallet?.chains?.[0]?.id, 16))
    }
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

onMounted(() => {
    store.commit('evm/setOverwriteChain', true)
})
</script>

<template>
    <div style="display: flex; justify-content: space-between;">
        <custom-select ref="selectedChainRef" :options="chains" v-model="selectedChain" @change="Evm.setChainById()" />

        <button type="button" @click="open" :class="connectedWallet ? 'button' : 'button__full'">
            {{ buttonLabel }}
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