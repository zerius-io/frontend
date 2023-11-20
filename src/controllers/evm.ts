import axios, { AxiosResponse } from 'axios'
import { ethers } from 'ethers'
import { useOnboard } from '@web3-onboard/vue'

import store from '@/store'

import Config from '@/controllers/config'

import ABI from '@/assets/ABI/evm.json'

import ABI_REFUEL from '@/assets/ABI/evm_refuel.json'
import ABI_RELAYER from '@/assets/ABI/evm_relayer.json'

import Starknet from './starknet.js'
import Utils from './utils.js'
import { _CHAIN } from './config.js'

const DEV = import.meta.env.DEV

const LZ_VERSION = 1

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

    // static set selectedChain(value: boolean) {
    //     store.commit('evm/setSelectedChain', value)
    // }

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

    static async setChainById(chainId?: number) {
        if (DEV) console.log('[SET CHAIN ID]', `${chainId ? 'SET' + chainId : ''}`, 'CURRENT', this.selectedChain.id)
        if (DEV) console.trace()

        try {
            if (!this.isWalletConnected || !this.selectedChain) return

            const CHANGE_TO_CHAIN_ID = chainId ? chainId : this.selectedChain.id;
            const CURRENT_CHAIN_ID = this.connectedWallet.provider.chainId

            if (CURRENT_CHAIN_ID === CHANGE_TO_CHAIN_ID || CURRENT_CHAIN_ID === this.toHex(CHANGE_TO_CHAIN_ID)) return

            let { setChain } = useOnboard()
            await setChain({ wallet: this.connectedWallet?.label, chainId: CHANGE_TO_CHAIN_ID })

            const provider = new ethers.BrowserProvider(this.web3)
            const WALLET_CHAIN_ID = Number((await provider.getNetwork())?.chainId)

            if (WALLET_CHAIN_ID === CHANGE_TO_CHAIN_ID) {
                if (DEV) console.log('SET CHAIN OK', CHANGE_TO_CHAIN_ID, 'IN WALLET', WALLET_CHAIN_ID)

                store.commit('evm/setSelectedChain', Config.getChainById(CHANGE_TO_CHAIN_ID))
                return
            }

            if (WALLET_CHAIN_ID !== CHANGE_TO_CHAIN_ID) {
                if (DEV) console.log('ERROR SET CHAIN TO', CHANGE_TO_CHAIN_ID, 'IN WALLET', WALLET_CHAIN_ID)

                store.commit('evm/setSelectedChain', Config.getChainById(CURRENT_CHAIN_ID))
                return
            }
        } catch (error) {
            if (DEV) console.error('ERROR switching chain', error)
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

            await this.setChainById()

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

    static async bridge(tokenId: number, chainId: number, toChain: number, refuel: boolean, toast?: (message: string, data?: any) => void): Promise<TxResult> {
        if (DEV) console.log('[BRIDGE]', 'TOKEN ID:', tokenId, 'CHAIN from', chainId, 'to', toChain, 'refuel', refuel)

        try {
            let selectedChain = store.getters['evm/selectedChain']
            if (selectedChain.id != chainId) {
                await this.setChainById(chainId)
                selectedChain = store.getters['evm/selectedChain']
            }

            const toChainConfig: _CHAIN = Config.getChainById(toChain)
            if (DEV) console.log('[BRIDGE] toChainConfig', toChainConfig)

            const _dstChainId = toChainConfig.lzChain
            // if (DEV) console.log('[BRIDGE] _dstChainId', _dstChainId)

            const contractAddress = selectedChain.contract

            if (!this.web3 || !this.isWalletConnected || !contractAddress || !_dstChainId) {
                if (DEV) console.error('Invalid configuration for bridge',
                    !this.web3, !this.isWalletConnected, contractAddress, _dstChainId)
                return {
                    result: false,
                    msg: 'Something went wrong :(',
                }
            }

            const provider = new ethers.BrowserProvider(this.web3)

            const signer = await provider.getSigner()
            const sender = await signer.getAddress()

            const _toAddress = ethers.solidityPacked(
                ["address"], [sender]
            )

            const contract = new ethers.Contract(contractAddress, ABI, signer)

            const MIN_DST_GAS = await contract.minDstGasLookup(_dstChainId, LZ_VERSION)

            let adapterParams;
            if (refuel) {
                const REFUEL_SETTINGS = Config.bridge.refuel
                if (DEV) console.log('REFUEL_SETTINGS', REFUEL_SETTINGS)
                // FIX ME -  Utils.findIdInObj
                const REFUEL_AMOUNT_USD = Utils.findIdInObj(REFUEL_SETTINGS.amount, toChainConfig.id)
                if (DEV) console.log('REFUEL_AMOUNT_USD', REFUEL_AMOUNT_USD)

                const price = await this.fetchPrice(toChainConfig.token)
                if (DEV) console.log('price', price)

                const REFUEL_AMOUNT = (REFUEL_AMOUNT_USD / price).toFixed(4)
                if (DEV) console.log('REFUEL_AMOUNT', REFUEL_AMOUNT)

                const refuelAmountEth = ethers.parseUnits(
                    REFUEL_AMOUNT,
                    18
                )

                adapterParams = ethers.solidityPacked(
                    ["uint16", "uint256", "uint256", "address"],
                    [2, MIN_DST_GAS, refuelAmountEth, sender]
                )

            } else {
                adapterParams = ethers.solidityPacked(
                    ["uint16", "uint256"],
                    [LZ_VERSION, MIN_DST_GAS]
                )
            }
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
                console.error('Error sent NFT:', error)
                this.errorParser(error)
            }

            return {
                result: false,
                msg: 'Send failed',
            }
        }
    }

    static errorParser(error: any) {
        try {
            let MSG = ''

            if (DEV) {
                console.log(error)
                console.log(error?.info)
                console.log(error?.reason)
            }

            return error?.reason
        } catch (error) {
            if (DEV) console.log('ERROR ON PARSER', error)
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

    static async getReceipt(txHash: string): Promise<any> {
        try {
            const provider = new ethers.BrowserProvider(this.web3)

            const receipt = await provider.getTransactionReceipt(txHash)
            return receipt
        } catch (error) {
            if (DEV) {
                console.error('Failed to fetch transaction receipt', error)
            }
            return null
        }
    }

    static async collection(): Promise<CollectionItem[]> {
        try {
            if (!this.web3 || !this.isWalletConnected) return
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

            const provider = new ethers.BrowserProvider(this.web3)
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
            if (DEV) console.error('Error fetching collection:', error)

            return []
        }
    }

    static async fetchPrice(symbol: string): Promise<number | null> {
        const url: string = `https://min-api.cryptocompare.com/data/price?fsym=${symbol.toUpperCase()}&tsyms=USDT`

        try {
            const response: AxiosResponse = await axios.get(url, { timeout: 10000 })

            if (response.status === 200 && response.data) {
                return parseFloat(response.data.USDT) || 0
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000))
                return this.fetchPrice(symbol)
            }
        } catch (error) {
            if (DEV) console.error('Error fetching price:', error)
            await new Promise(resolve => setTimeout(resolve, 1000))
            return this.fetchPrice(symbol)
        }

        // try {
        //     const response: AxiosResponse = await axios.get(url, { timeout: 10000 })

        //     if (response.status === 200 && response.data) {
        //         return parseFloat(response.data.USDT) || 0
        //     } else {
        //         if (DEV) console.warn(`Retrying fetchPrice due to response status: ${response.status}`)

        //         await new Promise(resolve => setTimeout(resolve, 1000))
        //         const retryResponse: AxiosResponse = await axios.get(url, { timeout: 10000 })

        //         if (retryResponse.status === 200 && retryResponse.data) {
        //             return parseFloat(retryResponse.data.USDT) || 0
        //         } else {
        //             if (DEV) console.log(`Failed to fetch price on retry. Status: ${retryResponse.status}`)
        //             return null
        //         }
        //     }
        // } catch (error) {
        //     console.error('Error fetching price:', error)
        //     return null
        // }
    }

    static async getBalance(normalize = false) {
        try {
            if (!this.web3 || !this.isWalletConnected) return

            const provider = new ethers.BrowserProvider(this.web3)

            const signer = await provider.getSigner()
            const sender = await signer.getAddress()
            const balance = await provider.getBalance(sender)

            if (DEV) console.log('getBalance', (normalize ? ethers.formatEther(balance) : balance))
            return (normalize ? ethers.formatEther(balance) : balance) || 0
        } catch (error) {
            if (DEV) console.error('getBalance ERROR', error)
            return 0
        }
    }

    static async getMaxTokenValueInDst(fromChainId: number, toChainId: number, normalize = false) {
        if (DEV) console.log('getMaxTokenValueInDst', 'from', fromChainId, 'to', toChainId)

        try {
            if (!this.web3 || !this.isWalletConnected) return

            const provider = new ethers.BrowserProvider(this.web3)

            const fromChainConfig: _CHAIN = Config.getChainById(fromChainId)
            const toChainConfig: _CHAIN = Config.getChainById(toChainId)

            if (DEV && !fromChainConfig.lzRelayer) console.log('NO RELAYER', fromChainConfig.label)
            if (!fromChainConfig.lzRelayer) return null

            const contract = new ethers.Contract(fromChainConfig.lzRelayer, ABI_RELAYER, provider)
            // if (DEV) console.log('getMaxTokenValueInDst', fromChainConfig.id, 'to', toChainId, toChainConfig.label, toChainConfig.lzChain)

            const dstConfig = await contract.dstConfigLookup(toChainConfig.lzChain.toString(), "2")
            // if (DEV) console.log('getMaxTokenValueInDst', (normalize ? ethers.formatEther(dstConfig.dstNativeAmtCap) : dstConfig.dstNativeAmtCap) || null)

            return (normalize ? ethers.formatEther(dstConfig.dstNativeAmtCap) : dstConfig.dstNativeAmtCap) || null
        } catch (error) {
            if (DEV) console.error('[ERROR] getMaxTokenValueInDst', error)
            return null
        }
    }

    static formatEthers(value: bigint) {
        return ethers.formatUnits(value, 'ether')
    }

    static async estimateRefuelFee(fromChainId: number, toChainId: number, amount: string): Promise<{ nativeFee: number, zroFee: number }> {
        const ZERO = 0, TWO = 2

        try {
            if (!this.web3 || !this.isWalletConnected) return

            const provider = new ethers.BrowserProvider(this.web3)
            const signer = await provider.getSigner()
            const sender = await signer.getAddress()

            const fromChainConfig: _CHAIN = Config.getChainById(fromChainId)
            const toChainConfig: _CHAIN = Config.getChainById(toChainId)
            if (DEV) console.log('selectedChain', fromChainConfig)
            if (DEV) console.log('toChainConfig', toChainConfig)

            const contract = new ethers.Contract(fromChainConfig.refuelContract, ABI_REFUEL, signer)
            if (DEV) console.log('contract', contract)

            const MIN_DST_GAS = await contract.minDstGasLookup(toChainConfig.lzChain, ZERO)
            if (DEV) console.log('MIN_DST_GAS', MIN_DST_GAS)

            const payload = ethers.solidityPacked(
                ["address"],
                [toChainConfig.refuelContract]
            )
            if (DEV) console.log('payload', payload)

            const adapterParams = ethers.solidityPacked(
                ["uint16", "uint256", "uint256", "address"],
                [TWO, MIN_DST_GAS, ethers.parseUnits(amount.toString(), 'ether'), sender]
            )
            if (DEV) console.log('adapterParams', toChainConfig.lzChain, adapterParams)

            const { nativeFee, zroFee } = await contract.estimateSendFee(toChainConfig.lzChain, payload, adapterParams)

            if (DEV) console.log('estimateRefuelFee', {
                nativeFee: Number(ethers.formatUnits(nativeFee, 'ether')),
                zroFee: Number(ethers.formatUnits(zroFee, 'ether'))
            })
            return {
                nativeFee: Number(ethers.formatUnits(nativeFee, 'ether')),
                zroFee: Number(ethers.formatUnits(zroFee, 'ether'))
            }
        } catch (error) {
            if (DEV) console.error('[Error] [estimating refuel fee]', error)
            return { nativeFee: null, zroFee: null }
        }
    }

    static async refuel(fromChainId: number, toChainId: number, amount: string, toast?: (message: string, data?: any) => void): Promise<TxResult> {
        if (DEV) console.log('[REFUEL]', 'from chain:', fromChainId, 'to chain', toChainId, 'amount', amount)

        try {
            let selectedChain = store.getters['evm/selectedChain']
            if (selectedChain.id != fromChainId) {
                await this.setChainById(fromChainId)
                selectedChain = store.getters['evm/selectedChain']
            }

            const provider = new ethers.BrowserProvider(this.web3)
            const signer = await provider.getSigner()
            const sender = await signer.getAddress()

            const fromChainConfig = Config.getChainById(fromChainId)
            const toChainConfig = Config.getChainById(toChainId)

            const contract = new ethers.Contract(fromChainConfig.refuelContract, ABI_REFUEL, signer)

            const _dstChainId = toChainConfig.lzChain

            const _toAddress = ethers.solidityPacked(
                ["address"],
                [toChainConfig.refuelContract]
            )

            const MIN_DST_GAS = await contract.minDstGasLookup(_dstChainId, 0)

            const _adapterParams = ethers.solidityPacked(
                ["uint16", "uint256", "uint256", "address"],
                [2, MIN_DST_GAS, ethers.parseUnits(amount, 'ether'), sender]
            )

            const feeEstimate = await contract.estimateSendFee(_dstChainId, _toAddress, _adapterParams)
            const nativeFee = BigInt(feeEstimate.nativeFee)

            const tx = await contract.refuel(_dstChainId, _toAddress, _adapterParams, { value: nativeFee })

            if (toast) {
                toast("Refueling...", { id: fromChainId, hash: tx.hash })
            }

            const receipt = await tx.wait()

            return {
                result: receipt.status === 1,
                msg: receipt.status === 1 ? 'Refuel successful' : 'Refuel failed',
                receipt
            }
        } catch (error) {
            if (DEV) console.error('Error during refuel:', error);
            return {
                result: false,
                msg: 'Refuel failed',
            };
        }
    }
}