export default {
    namespaced: true,
    state: {
        connectedWallet: null,
        connectedChain: null,
        selectedChain: null,
    },
    mutations: {
        setConnectedWallet(state, wallet) {
            state.connectedWallet = wallet;
        },
        setSelectedChain(state, selectedChain) {
            state.selectedChain = selectedChain;
        },
        setConnectedChain(state, chain) {
            state.connectedChain = chain;
        },
    },
    actions: {
        initializeState({ commit }) {
            commit('setConnectedWallet', null);
            commit('setConnectedChain', null);
            commit('setSelectedChain', null);
        },
    },
    getters: {
        connectedWallet: (state) => state.connectedWallet,
        connectedChain: (state) => state.connectedChain,
        selectedChain: (state) => state.selectedChain,
    },
}