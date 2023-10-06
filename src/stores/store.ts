// store.js
import { reactive } from 'vue'

const state = reactive({
    connectedWallet: null,
    connectedChain: null,
    connectingWallet: false,
    selectedChain: null,
})

const getters = {
    getConnectedWallet: () => state.connectedWallet,
    getConnectedChain: () => state.connectedChain,
    getConnectingWallet: () => state.connectingWallet,
    getSelectedChain: () => state.selectedChain,
}

const mutations = {
    setConnectedWallet: (wallet) => {
        state.connectedWallet = wallet
    },
    setConnectedChain: (chain) => {
        state.connectedChain = chain
    },
    setConnectingWallet: (connecting) => {
        state.connectingWallet = connecting
    },
    setSelectedChain: (selectedChain) => {
        state.selectedChain = selectedChain
    },
}

const actions = {
    initializeState() {
        state.connectedWallet = null
        state.connectedChain = null
        state.connectingWallet = false
        state.selectedChain = null
    },
}

export default {
    state,
    getters,
    mutations,
    actions,
}