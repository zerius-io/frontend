import store from '@/stores/store'

import { useOnboard } from '@web3-onboard/vue'
import { Ref } from 'vue'

import { ChainType } from './config'

export default class Evm {
    static get connectedWallet() {
        const { connectedWallet } = useOnboard()
        return connectedWallet.value
    }

    static get isWalletConnected() {
        return !!this.connectedWallet?.label
    }

    static async toggleWallet(connectingWallet: Ref, selectedChain: ChainType) {
        const {
            connectWallet,
            connectedWallet,
            disconnectConnectedWallet
        } = useOnboard()

        // const connectingWallet = store.getters.getConnectedWallet()
        // const selectedChain = store.getters.getSelectedChain()

        console.log(connectedWallet)
        console.log(selectedChain)

        if (this.isWalletConnected) {
            console.log('Disconnecting wallet...');
            await disconnectConnectedWallet()

            store.mutations.setConnectedWallet(undefined)
        } else {
            console.log('Connecting wallet...');
            connectingWallet.value = true

            try {
                await connectWallet()
                console.log('Wallet connected', connectedWallet)

                await this.switchChain(selectedChain)

                if (!this.isWalletConnected) return
                store.mutations.setConnectedWallet(connectedWallet.value)
            } catch (error) {
                console.error('Error connecting wallet:', error)
            } finally {
                connectingWallet.value = false
            }
        }
    }

    static async switchChain(selectedChain: ChainType) {
        if (!this.isWalletConnected) return
        const currentChainId = this.connectedWallet.provider.chainId

        if (currentChainId !== this.toHex(selectedChain.id)) {
            this.setChainById(selectedChain)
        }
    }

    static setChainById(selectedChain: ChainType) {
        const { setChain } = useOnboard()

        if (this.isWalletConnected && selectedChain) {
            setChain({ wallet: this.connectedWallet.label, chainId: selectedChain.id })
            store.mutations.setSelectedChain(selectedChain)
        }
    }

    static formatAddress(address: string) {
        const startChars = address.slice(0, 6)
        const endChars = address.slice(-4)

        return `${startChars}...${endChars}`.toUpperCase()
    }

    static toHex(d: number) {
        return ('0' + (Number(d).toString(16))).slice(-2).toUpperCase()
    }
}
