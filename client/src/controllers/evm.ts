import axios from 'axios'
import { ethers } from 'ethers'
import { useOnboard } from '@web3-onboard/vue'

import store from '@/store'

import Config from '@/controllers/config'

import ABI from '@/assets/ABI/evm.json'
import Starknet from './starknet.js'

const DEV = import.meta.env.DEV

const API_URL = DEV ?
    `http://localhost:3000/api/collection` :
    `https://zerius.io/api/collection`

export interface TxResult {
    result: boolean;
    msg?: string;
    receipt?: any;
}

export interface CollectionItem {
    chainId: number | null
    id: number
    uri: string
}
export default class Evm {
    static get web3() {
        return window.ethereum
    }

    static get connectedWallet() {
        const { connectedWallet } = useOnboard()
        return connectedWallet.value
    }

    static set connectedWallet(wallet: any) {
        store.commit('evm/setConnectedWallet', wallet)
    }

    static get isWalletConnected() {
        return !!this.connectedWallet?.label || ''
    }

    static get walletAddress(): string {
        return this.connectedWallet?.accounts?.[0].address || null
    }

    static get walletConnectRef() {
        return store.state.evm.walletConnectRef
    }

    static set walletConnectRef(value: boolean) {
        store.commit('evm/setWalletConnectRef', value)
    }

    static get selectedChain() {
        return store.state.evm.selectedChain
    }

    static get walletChainId(): number {
        return (this.isWalletConnected) ? parseInt(this.web3.chainId) : null
    }

    static async toggleWallet() {
        const { connectWallet, connectedWallet, disconnectConnectedWallet } = useOnboard()

        if (DEV) console.log('WALLET CONNECT', connectedWallet, this.selectedChain)

        if (this.isWalletConnected) {
            await disconnectConnectedWallet()
            this.connectedWallet = undefined
        }

        try {
            this.walletConnectRef = true

            await connectWallet()
            await this.setChainById()

            this.connectedWallet = connectedWallet.value

            store.commit('evm/setCollection', null)
        } catch (error) {
            if (DEV) console.error('Error connecting EVM wallet:', error)
        } finally {
            this.walletConnectRef = false
        }
    }

    static async setChainById() {
        // if (DEV) console.log('SET CHAIN')
        try {
            if (!this.isWalletConnected || !this.selectedChain) return

            const currentChainId = this.connectedWallet.provider.chainId

            if (currentChainId === this.toHex(this.selectedChain.id)) {
                if (DEV) console.log('NOTHING TO CHANGE')
                return
            }

            if (DEV) console.log('SETTING', { wallet: this.connectedWallet?.label, chainId: this.selectedChain.id })

            if (this.selectedChain.id !== null) {
                const { setChain } = useOnboard()

                await setChain({ wallet: this.connectedWallet?.label, chainId: this.selectedChain.id })
            }

            store.commit('evm/setSelectedChain', this.selectedChain)

            if (DEV) console.log(this.selectedChain)
        } catch (error) {
            if (DEV) console.error('Error switch chain:', error)
        }
    }

    static formatAddress(address: string) {
        const startChars = address.slice(0, 6)
        const endChars = address.slice(-4)

        return `${startChars}...${endChars}`.toUpperCase()
    }

    static toHex(d: number | string) {
        return ('0' + (Number(d).toString(16))).slice(-2).toUpperCase()
    }

    static async mint(toast?: (message: string, data?: any) => void): Promise<TxResult> {
        try {
            if (DEV) console.log('Mint..')

            if (!this.isWalletConnected) {
                await this.toggleWallet()
            }

            this.setChainById()

            const selectedChain = store.getters['evm/selectedChain']

            const contractAddress = selectedChain.contract

            if (DEV) console.log(selectedChain, contractAddress)

            if (!this.web3 || !this.isWalletConnected || !contractAddress) {
                if (DEV) console.log(!this.web3, !this.isWalletConnected, !contractAddress)

                return {
                    result: false,
                    msg: 'Something went wrong :(',
                }
            }

            const web3 = this.web3
            const provider = new ethers.BrowserProvider(web3)

            const signer = await provider.getSigner()
            const sender = await signer.getAddress()

            const contract = new ethers.Contract(contractAddress, ABI, signer)
            const mintFee = await contract.mintFee()

            let options = { value: BigInt(mintFee), gasLimit: BigInt(0) }

            const TOTAL_COST = mintFee

            const userBalance = await provider.getBalance(sender)
            if (DEV) console.log('userBalance', userBalance)
            if (userBalance < TOTAL_COST) {
                if (DEV) console.log('Not enough funds to mint')
                return {
                    result: false,
                    msg: 'Not enough funds to mint',
                }
            }

            const gasLimit = await contract.mint.estimateGas(options)
            options.gasLimit = gasLimit

            const txResponse = await contract.mint(options)

            if (DEV) {
                console.log('Transaction sent:', txResponse)
            }

            if (toast) toast("Minting..", { id: selectedChain?.id, hash: txResponse?.hash })

            const receipt = await txResponse.wait(null, 60000)

            if (DEV) {
                console.log('Mint confirmed:', receipt)
            }

            return {
                result: receipt.status === 1,
                msg: receipt.status === 1 ? 'Successful Mint' : (receipt.status == null ? 'Mint not confirmed' : 'Mint Failed'),
                receipt
            }
        } catch (error) {
            if (DEV) console.error('Error minting NFT:', error)

            return {
                result: false,
                msg: 'Mint Failed'
            }
        }
    }

    static async bridge(tokenId: number, chainId: number, toChain: number, toast?: (message: string, data?: any) => void): Promise<TxResult> {
        const LZ_VERSION = 1

        try {
            if (DEV) console.log('BRIDGE', 'id', tokenId, 'from chain', chainId, 'to', toChain)

            const selectedChain = store.getters['evm/selectedChain']
            if (selectedChain.id != chainId) await this.setChainById()

            const toChainConfig = Config.getChainById(toChain)
            // if (DEV) console.log('toChainConfig', toChainConfig)

            const _dstChainId = toChainConfig.lzChain
            // if (DEV) console.log('_dstChainId', _dstChainId)

            const contractAddress = selectedChain.contract

            if (!this.web3 || !this.isWalletConnected || !contractAddress || !_dstChainId) {
                if (DEV) console.error('Invalid configuration for bridge',
                    !this.web3, !this.isWalletConnected, contractAddress, _dstChainId)
                return {
                    result: false,
                    msg: 'Something went wrong :(',
                }
            }

            const web3 = this.web3
            const provider = new ethers.BrowserProvider(web3)

            const signer = await provider.getSigner()
            const sender = await signer.getAddress()

            const _toAddress = ethers.solidityPacked(
                ["address"], [sender]
            )

            const contract = new ethers.Contract(contractAddress, ABI, signer)

            const MIN_DST_GAS = await contract.minDstGasLookup(_dstChainId, 1)

            const adapterParams = ethers.solidityPacked(
                ["uint16", "uint256"],
                [LZ_VERSION, MIN_DST_GAS]
            )
            if (DEV) console.log('adapterParams', adapterParams)

            const { nativeFee } = await contract.estimateSendFee(
                _dstChainId,
                _toAddress,
                tokenId,
                false,
                adapterParams
            )
            if (DEV) console.log('nativeFee', nativeFee)

            const TOTAL_COST = nativeFee
            if (DEV) console.log('TOTAL_COST', TOTAL_COST)

            const userBalance = await provider.getBalance(sender)
            if (userBalance < TOTAL_COST) {
                if (DEV) console.log('Not enough funds to send')
                return {
                    result: false,
                    msg: 'Not enough funds to send',
                }
            }

            let bridgeOptions = {
                value: TOTAL_COST,
                gasLimit: BigInt(0)
            }
            if (DEV) console.log('bridgeOptions', bridgeOptions)

            const estimatedGasLimit = await contract.sendFrom.estimateGas(
                sender,
                _dstChainId,
                _toAddress,
                tokenId,
                sender,
                ethers.ZeroAddress,
                adapterParams,
                bridgeOptions
            )
            bridgeOptions.gasLimit = estimatedGasLimit
            if (DEV) console.log('estimatedGasLimit', estimatedGasLimit)

            const transaction = await contract.sendFrom(
                sender,
                _dstChainId,
                _toAddress,
                tokenId,
                sender,
                ethers.ZeroAddress,
                adapterParams,
                bridgeOptions
            )
            if (DEV) console.log('transaction', transaction)

            if (toast) toast("Sending..", { id: selectedChain?.id, hash: transaction?.hash })

            const receipt = await transaction.wait(null, 60000)

            if (DEV) console.log('Send successful:', receipt)
            return {
                result: receipt.status === 1,
                msg: receipt.status === 1 ? 'Successful send' : (receipt.status == null ? 'Send not confirmed' : 'Send failed'),
                receipt
            }
        } catch (error) {
            if (DEV) {
                console.error('Error sent NFT:', error);
            }

            return {
                result: false,
                msg: 'Send failed',
            }
        }
    }

    static async isTransactionConfirmed(provider: any, txHash: string, requiredConfirmations = 6) {
        const receipt = await provider.getTransactionReceipt(txHash)
        return receipt && receipt.confirmations >= requiredConfirmations && receipt.status === 1
    }

    static async waitForConfirmation(provider: any, txHash: string, retries = 3, delay = 5000) {
        let attempts = 0

        const attemptCheck = async (resolve: (arg0: boolean) => any, reject: (arg0: Error) => any) => {
            if (attempts >= retries) {
                return reject(new Error('Transaction not confirmed after maximum retries.'))
            }

            const confirmed = await this.isTransactionConfirmed(provider, txHash)
            if (confirmed) return resolve(true)

            attempts += 1
            setTimeout(() => attemptCheck(resolve, reject), delay)
        }

        return new Promise(attemptCheck)
    }

    static async collection(): Promise<CollectionItem[]> {
        try {
            if (!this.isWalletConnected) return
            if (DEV) console.log('FETCH COLLECTION')

            let payload: any = {}

            const evmAddress = this.walletAddress
            if (evmAddress && evmAddress.length === 42) payload.evmAddress = evmAddress

            const starknetAddress = Starknet.connectedWallet
            if (starknetAddress && (starknetAddress.length <= 65 && starknetAddress.length <= 66)) payload.starknetAddress = starknetAddress

            if (DEV) console.log('FETCH COLLECTION DO', evmAddress, starknetAddress)

            const response = await axios.post(API_URL, { evmAddress, starknetAddress })

            const data: CollectionItem[] = response.data || []

            if (DEV) console.log('FETCHED COLLECTION', data)
            return data
        } catch (error) {
            if (DEV) console.error('[Error] fetching collection', error)

            const fallback = await this._collection()

            return fallback || []
        }
    }

    static async _collection() { // *
        try {
            if (!this.web3 || !this.isWalletConnected) return
            const web3 = this.web3

            const provider = new ethers.BrowserProvider(web3)
            const signer = await provider.getSigner()
            const owner = await signer.getAddress()

            const ITEMS = []

            try {
                const chainId = Number(this.connectedWallet.provider.chainId)
                const CHAIN = Config.getChainById(chainId)

                if (CHAIN && CHAIN.contract) {
                    // if (DEV) console.log('COLLECTION', chainId, contractAddress)
                    const contract = new ethers.Contract(CHAIN.contract, ABI, signer)

                    const tokensCount = Number(await contract.balanceOf(owner))

                    const chainItems = []
                    for (let i = 0; i < tokensCount; i++) {
                        const id = Number(await contract.tokenOfOwnerByIndex(owner, i))
                        const uri = Config.getIpfsUri(id)

                        const item = { chainId, id, uri }
                        chainItems.push(item)

                        // yield item
                    }

                    if (chainItems.length) ITEMS.push(chainItems)
                }
            } catch (error) {
                // if (DEV) console.error('Error fetch:', chainId, error)
            }

            return ITEMS.flat().sort((a, b) => a.id - b.id)
        } catch (error) {
            if (DEV) {
                console.error('Error fetching collection:', error)
            }

            return []
        }
    }

    static async getReceipt(txHash: string): Promise<any> {
        try {
            const web3 = this.web3
            const provider = new ethers.BrowserProvider(web3)

            const receipt = await provider.getTransactionReceipt(txHash)
            return receipt
        } catch (error) {
            if (DEV) {
                console.error('Failed to fetch transaction receipt', error)
            }
            return null
        }
    }
}