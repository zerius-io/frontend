import { _CHAIN } from '@/components/config.js'

const DEV = import.meta.env.DEV

export default {
  state: {
    config: {}
  },
  mutations: {
    setConfig(state, config) {
      state.config = config
    }
  },
  actions: {
    async config({ commit }) {
      try {
        const response = await fetch('/config.json')
        const data = await response.json()

        let CHAINS = data.chains

        if (!DEV) {
          CHAINS = CHAINS.filter((chain: _CHAIN) => !chain.testnet)
        }

        CHAINS = CHAINS.filter((chain: _CHAIN) => {
          return chain?.hide === undefined
        })

        // console.log('CHAINS', CHAINS)

        commit('setConfig', { ipfs: data.ipfs, chains: CHAINS })
      } catch (error) {
        if (DEV) console.error('Error fetching the config:', error)
      }
    }
  }
}