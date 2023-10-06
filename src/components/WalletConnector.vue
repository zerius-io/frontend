<template>
    <div style="display: flex; justify-content: space-between;">
        <custom-select ref="selectedChainRef" :options="chains" v-model="selectedChain" @change="setChainById" />

        <button type="button" @click="toggleWallet" :class="connectedWallet ? 'button' : 'button__full'">
            {{ connectedWallet ? formatWalletAddress(connectedWallet?.accounts[0]?.address) : connectingWallet ?
                'Connecting...' : 'Connect wallet'
            }}
        </button>
    </div>
</template>
  
<script lang="js">
import { defineComponent, ref, isProxy, toRaw, computed } from 'vue'
import store from '@/stores/store'

import CustomSelect from "./Select.vue"

import Zerius, { chains, lzChains, contracts } from './config'

import { init } from '@web3-onboard/vue'
import { useOnboard } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'

const injected = injectedModule()

const web3Onboard = init({
    wallets: [injected],
    chains: chains
})

export default defineComponent({
    name: 'Header',
    components: {
        CustomSelect,
    },
    data() {
        return {
            chains,
            selectedChain: null,
        }
    },
    setup() {
        const {
            connectWallet,
            connectedWallet,
            disconnectConnectedWallet,
            connectedChain,
            switchChain,
            connect,
            disconnect,
            setChain
        } = useOnboard()

        const selectedChainRef = ref(null)
        const connectingWallet = ref(false)

        const toggleWallet = async () => {
            console.log(connectedWallet, connectedWallet.label)

            if (connectedWallet.label) {
                console.log('Disconnecting wallet...')
                await disconnectConnectedWallet()
            } else {
                console.log('Connecting wallet...')
                connectingWallet.value = true

                try {
                    await connectWallet()
                    console.log('Wallet connected', connectedWallet)

                    await setSwitchChain()

                    store.mutations.setConnectedWallet(connectedWallet.value)
                } catch (error) {
                    console.error('Error connecting wallet:', error)
                } finally {
                    connectingWallet.value = false
                }
            }
        }

        function setChainById() {
            try {
                const walletLabel = connectedWallet.value?.label
                const value = selectedChainRef.value.selected

                if (walletLabel && value) {
                    setChain({ wallet: walletLabel, chainId: toRaw(value).id })
                    store.mutations.setSelectedChain(selectedChainRef.value)
                }
            } catch (error) { }
        }

        function setSwitchChain() {
            try {
                const currentChainId = connectedWallet.value?.provider?.chainId
                const selectedChainId = selectedChainRef.value.selected.id
                // console.log(currentChainId, selectedChainId, toHex(selectedChainId))
                if (currentChainId !== toHex(selectedChainId)) setChainById()
            } catch (error) { }
        }

        function formatWalletAddress(address) {
            if (address) {
                const startChars = address.slice(0, 6)
                const endChars = address.slice(-4)
                return `${startChars}...${endChars}`.toUpperCase()
            }
            return ''
        }

        function toHex(d) {
            return ("0" + (Number(d).toString(16))).slice(-2).toUpperCase()
        }

        return {
            connect,
            disconnect,
            connectingWallet,
            formatWalletAddress,
            switchChain,
            toggleWallet,
            setChainById,
            selectedChainRef,
            connectedWallet: computed(() => store.getters.getConnectedWallet()),
            connectedChain: computed(() => store.getters.getSelectedChain()),
        }
    },
})
</script>
  
<style class="scss"></style>
  