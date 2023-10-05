<template>
    <div style="display: flex; justify-content: space-between;">
        <custom-select ref="selectedChain" :options="chains" v-model="selectedChain" @change="setChainById" />

        <button type="button" @click="toggleWallet" :class="connectedWallet ? 'button' : 'button__full'">
            {{ connectedWallet ? formatWalletAddress(connectedWallet?.accounts[0]?.address) : connectingWallet ?
                'Connecting...' : 'Connect wallet'
            }}
        </button>
    </div>
</template>
  
<script lang="js">
import { defineComponent, ref, isProxy, toRaw } from 'vue'

import CustomSelect from "./Select.vue"

import { chains, lzChains, contracts } from './config'

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
        const { connectWallet, disconnectConnectedWallet, connectedWallet, connectedChain, switchChain, connect, disconnect, setChain } = useOnboard()

        const connectingWallet = ref(false)
        const selectedChain = ref(null)

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
                } catch (error) {
                    console.error('Error connecting wallet:', error)
                } finally {
                    connectingWallet.value = false
                }
            }
        }

        const setChainById = () => {
            try {
                const walletLabel = connectedWallet.value?.label
                const value = selectedChain.value.selected

                if (walletLabel && value) {
                    // console.log(walletLabel, value)

                    if (isProxy(value)) {
                        const selectedChainId = toRaw(value)
                        // console.log(walletLabel, selectedChainId)
                        setChain({ wallet: walletLabel, chainId: selectedChainId.id })
                    }
                }
            } catch (error) {

            }
        }

        const formatWalletAddress = (address) => {
            if (address) {
                const startChars = address.slice(0, 6)
                const endChars = address.slice(-4)
                return `${startChars}...${endChars}`.toUpperCase()
            }
            return ''
        }

        return {
            connect,
            disconnect,
            connectedWallet,
            connectingWallet,
            connectedChain,
            formatWalletAddress,
            switchChain,
            toggleWallet,
            setChainById,
            selectedChain,
        }
    },
})
</script>
  
<style class="scss"></style>
  