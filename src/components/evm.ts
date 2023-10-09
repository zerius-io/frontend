import { Ref } from 'vue'
import { ethers } from 'ethers'
import { useOnboard } from '@web3-onboard/vue'

import store from '@/store'
import Zerius, { ChainType } from './config'

import ABI from '@/assets/ABI.json'

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

        console.log(connectedWallet)
        console.log(selectedChain)

        if (this.isWalletConnected) {
            console.log('Disconnecting wallet...');
            await disconnectConnectedWallet()

            store.commit('wallet/setConnectedWallet', undefined)
        } else {
            console.log('Connecting wallet...');
            connectingWallet.value = true

            try {
                await connectWallet()
                console.log('Wallet connected', connectedWallet)

                await this.switchChain(selectedChain)

                if (!this.isWalletConnected) return
                store.commit('wallet/setConnectedWallet', connectedWallet.value)
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
            store.commit('wallet/setSelectedChain', selectedChain)
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

    static async mint() {
        try {
            const selectedChain = store.getters['wallet/selectedChain']
            const contractAddress = Zerius.getContractForChain(selectedChain.id)

            if (!window.ethereum || !this.connectedWallet.label || !contractAddress) return false
            const web3 = window.ethereum
            console.log(web3)

            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()

            const contract = new ethers.Contract(contractAddress, ABI, signer)

            const transaction = await contract.mint()
            const receipt = await transaction.wait()

            console.log('Minting successful:', receipt)

            return receipt.status as boolean
        } catch (error) {
            console.error('Error minting NFT:', error)
            return false
        }
    }

    static async bridge() {

    }
}
