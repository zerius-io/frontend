export default {
    namespaced: true,
    state: {
        provider: undefined,
        walletConnectRef: null,
        connectedWallet: null
    },
    mutations: {
        setProvider(state, provider) {
            state.provider = provider
        },
        setWalletConnectRef(state, wallet) {
            state.walletConnectRef = wallet
        },
        setConnectedWallet(state, wallet) {
            state.connectedWallet = wallet
        }
    },
    actions: {
        initializeState({ commit }) {
            commit('setProvider', undefined)
            commit('setWalletConnectRef', null)
            commit('setConnectedWallet', null)
        },
    },
    getters: {
        provider: (state) => state.provider,
        walletConnectRef: (state) => state.walletConnectRef,
        connectedWallet: (state) => state.connectedWallet
    },
}