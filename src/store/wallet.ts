import { mapGetters } from 'vuex'

export default {
    namespaced: true,
    computed: {
        ...mapGetters([
            'walletConnectRef',
            'selectedChain',
            'collection',
            'overwriteChain'
        ])
    },
    state: {
        walletConnectRef: null,
        selectedChain: null,

        collection: false,
        overwriteChain: false,

        connectedWallet: null,
        connectedChain: null,
    },
    mutations: {
        setWalletConnectRef(state, wallet) {
            state.walletConnectRef = wallet
        },
        setSelectedChain(state, selectedChain) {
            state.selectedChain = selectedChain;
        },

        setCollection(state, collection) {
            state.collection = collection
        },
        setOverwriteChain(state, chain) {
            state.overwriteChain = chain
        },

        setConnectedWallet(state, wallet) {
            state.connectedWallet = wallet;
        },

        setConnectedChain(state, chain) {
            state.connectedChain = chain;
        },
    },
    actions: {
        initializeState({ commit }) {
            commit('setWalletConnectRef', null)
            commit('setSelectedChain', null)

            commit('setCollection', false)
            commit('setOverwriteChain', false)

            commit('setConnectedWallet', null)
            commit('setConnectedChain', null)
        },
    },
    getters: {
        walletConnectRef: (state) => state.walletConnectRef,
        selectedChain: (state) => state.selectedChain,

        collection: (state) => state.collection,
        overwriteChain: (state) => state.overwriteChain,

        connectedWallet: (state) => state.connectedWallet,
        connectedChain: (state) => state.connectedChain,
    },
}