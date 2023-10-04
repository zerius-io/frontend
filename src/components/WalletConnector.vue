<template>
    <div style="display: flex;">
        <button v-if="connectedWallet" type="button" @click="set">Switch Chain ({{ connectedChain.id }})</button>

        <custom-select :options="chainOptions" v-model="selectedChain" />

        <button type="button" @click="toggleWallet">
            {{ connectedWallet ?
                formatWalletAddress(connectedWallet.accounts[0].address) : connectingWallet ? 'Connecting...'
                    : 'Connect wallet' }}
        </button>
    </div>
</template>
  
<script>
import { defineComponent, ref } from 'vue'

import CustomSelect from "./CustomSelect.vue"

import { init } from '@web3-onboard/vue'
import { useOnboard } from '@web3-onboard/vue'
import injectedModule from '@web3-onboard/injected-wallets'

const injected = injectedModule()

const chains = [
    {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum',
        rpcUrl: 'https://ethereum.publicnode.com',
    },
    {
        id: '0xa4b1',
        token: 'ARB-ETH',
        label: 'Arbitrum',
        rpcUrl: 'https://rpc.ankr.com/arbitrum'
    },
    {
        id: '0xa4ba',
        token: 'ARB',
        label: 'Arbitrum Nova',
        rpcUrl: 'https://nova.arbitrum.io/rpc'
    },
    {
        id: '0x38',
        token: 'BNB',
        label: 'Binance Smart Chain',
        rpcUrl: 'https://nova.arbitrum.io/rpc',
        icon: 'bnb.svg'
    }
]

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
            chainOptions: chains,
            selectedChain: null,
        }
    },
    setup() {
        const { connectWallet, disconnectConnectedWallet, connectedWallet, connectedChain, switchChain, alreadyConnectedWallets, connect, disconnect, setChain } = useOnboard()
        const connectingWallet = ref(false)

        const toggleWallet = async () => {
            console.log('Toggle wallet button clicked')

            console.log(connectedWallet, connectedWallet.label)

            if (connectedWallet.label) {
                console.log('Disconnecting wallet...')
                await disconnectConnectedWallet()
                console.log('Wallet disconnected')
            } else {
                console.log('Connecting wallet...')
                connectingWallet.value = true

                try {
                    await connectWallet()
                    console.log('Wallet connected')
                } catch (error) {
                    console.error('Error connecting wallet:', error)
                } finally {
                    connectingWallet.value = false
                }
            }
        }

        const set = () => setChain({ wallet: 'MetaMask', chainId: '0x1' })

        const formatWalletAddress = (address) => {
            if (address) {
                const startChars = address.slice(0, 6)
                const endChars = address.slice(-4)
                return `0x${startChars}...${endChars}`
            }
            return ''
        }

        return { connect, disconnect, connectedWallet, connectingWallet, connectedChain, alreadyConnectedWallets, formatWalletAddress, switchChain, toggleWallet, set }
    },
})
</script>
  
<style class="scss"></style>
  