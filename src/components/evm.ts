import { Ref } from 'vue'
import { ethers } from 'ethers'
import { useOnboard } from '@web3-onboard/vue'

import store from '@/store'

import Zerius, { ChainType } from './config'
import ABI from '@/assets/ABI.json'

interface TxResult {
    success: boolean;
    receipt?: any;
    errorMessage?: string;
}

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

            if (!window.ethereum || !this.isWalletConnected || !contractAddress) return false
            const web3 = window.ethereum
            console.log(web3)

            const provider = new ethers.BrowserProvider(web3)
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

    static async bridge(tokenId: number, toAddress: string, refundAddress: string, zroPaymentAddress: string): Promise<TxResult> {
        try {
            const selectedChain = store.getters['wallet/selectedChain']
            const contractAddress = Zerius.getContractForChain(selectedChain.id)

            if (!window.ethereum || !this.isWalletConnected || !contractAddress) {
                console.error('Invalid configuration for bridge')
                return false
            }
            const web3 = window.ethereum

            const provider = new ethers.BrowserProvider(web3)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, ABI, signer)

            // Estimate fees
            const { nativeFee, zroFee } = await contract.estimateSendFee(
                selectedChain.destinationChainId,
                toAddress,
                tokenId,
                false,  // Assuming you don't want to use ZRO for fee
                ethers.utils.defaultAbiCoder.encode(['uint256'], [1])  // Assuming LZ_VERSION is 1
            )

            // Check user's balance
            const userBalance = await signer.getBalance()
            const totalCost = nativeFee.add(zroFee)

            if (userBalance.lt(totalCost)) {
                console.error('Insufficient funds')
                return false
            }

            // Mint
            const transaction = await contract.sendFrom(
                this.connectedWallet.address,
                selectedChain.destinationChainId,
                toAddress,
                tokenId,
                refundAddress,
                zroPaymentAddress,
                ethers.utils.defaultAbiCoder.encode(['uint256'], [1]),
                { value: nativeFee }
            )

            const receipt = await transaction.wait()

            console.log('Bridge successful:', receipt);

            return {
                success: receipt.status === 1,
                receipt
            }
        } catch (error) {
            console.error('Error bridging NFT:', error);
            return {
                success: false,
                errorMessage: 'Error bridging NFT',
            }
        }
    }

    static async collection() {
        const fetchWithRetry = async (fetchFunction, maxRetries = 3, delay = 1000) => {
            let retries = 0
            while (retries < maxRetries) {
                try {
                    return await fetchFunction()
                } catch (error) {
                    // console.error('Error:', error)
                    await new Promise(resolve => setTimeout(resolve, delay))
                    retries++
                }
            }
        }

        try {
            if (!window.ethereum || !Evm.isWalletConnected) return
            const web3 = window.ethereum

            const provider = new ethers.BrowserProvider(web3)
            const signer = await provider.getSigner()
            const owner = await signer.getAddress()

            const ITEMS = []

            for (const [chainId, contractAddress] of Object.entries(Zerius.getAllContracts())) {
                const contract = new ethers.Contract(contractAddress, ABI, signer)

                const tokensCount = Number(await contract.balanceOf(owner))

                const chainItems = []
                for (let i = 0; i < tokensCount; i++) {
                    const fetchFunction = async () => {
                        const id = Number(await contract.tokenOfOwnerByIndex(owner, i))
                        const uri = await contract.tokenURI(id)
                        return { chainId, id, uri }
                    }

                    try {
                        const result = await fetchWithRetry(fetchFunction, 3, 1000)
                        chainItems.push(result);
                    } catch (error) {
                        // console.error('Error fetching item:', error)
                    }
                }

                if (chainItems.length) ITEMS.push(chainItems)
            }

            return ITEMS.flat().sort((a, b) => a.id - b.id)
        } catch (error) {
            // console.error('Error fetching collection:', error)
            return []
        }
    }
}
