import { cairo, Contract, Uint256 } from "starknet"
import * as StarknetCore from "get-starknet-core"

import store from '@/store'

import Config from '@/controllers/config'
import { TxResult } from './evm.js'

import ABI from '@/assets/ABI/starknet.json'
import ABI_ETH from '@/assets/ABI/starknet_eth.json'

const DEV = import.meta.env.DEV

const ETH_CONTRACT = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'


export type _starknetWalletType = 'argent' | 'braavos'

export interface _starknetWallet {
    id: string
    name: string
    icon: string
    account: _starknetAccountInfo
    provider: {
        provider: _starknetProviderInfo
    }
    selectedAddress: string
    chainId: string
    isConnected: boolean
    version: string
    starknetJsVersion: string
    enable: (params: { starknetVersion: string }) => any
}

export type _starknetProviderInfo = {
    responseParser: any
    baseUrl: string
    feederGatewayUrl: string
    gatewayUrl: string
    chainId: string
    blockIdentifier: string
}

export type _starknetAccountInfo = {
    provider: _starknetProviderInfo
    address: string
    signer: any
    cairoVersion?: string
}

export type _starknetTx = {
    transaction_hash: string
}

export default class Starknet {

    static set provider(starknet: any) {
        store.commit('starknet/setProvider', starknet)
    }

    static get provider() {
        return store.state.starknet.provider
    }

    static get connectedWallet() {
        return store.state.starknet.connectedWallet
    }

    static set connectedWallet(wallet: any) {
        store.commit('starknet/setConnectedWallet', wallet)
    }

    static get isWalletConnected() {
        return !!this.connectedWallet
    }

    static get walletConnectRef() {
        return store.state.starknet.walletConnectRef
    }

    static set walletConnectRef(value: boolean) {
        store.commit('starknet/setWalletConnectRef', value)
    }

    static set walletType(type: string) {
        store.commit('starknet/setWalletType', type)
    }

    static get walletType() {
        return store.state.starknet.walletType
    }

    static walletInArray(arr: any[], walletType: _starknetWalletType | string): _starknetWallet | undefined {
        walletType = walletType.toLowerCase()
        return arr.find(wallet => wallet?.name.toLowerCase().includes(walletType)) || undefined
    }

    static async toggleWallet(walletType?: _starknetWalletType) {
        if (DEV) console.log('STARKNET WALLET TOOGLE', walletType)

        let WALLET: _starknetWallet | undefined = undefined

        try {
            const discoveryWallets = await StarknetCore.default.getDiscoveryWallets()
            const availableWallets = await StarknetCore.default.getAvailableWallets()

            if (DEV) console.log('discoveryWallets', discoveryWallets)
            if (DEV) console.log('availableWallets', availableWallets)

            const lastConnectedWallet = await StarknetCore.default.getLastConnectedWallet()
            if (DEV) console.log('lastConnectedWallet', lastConnectedWallet)

            let walletToConnect = undefined

            if (walletType) {
                walletToConnect = this.walletInArray(availableWallets, walletType) || this.walletInArray(discoveryWallets, walletType)
            }

            if (!walletType) {
                if (availableWallets && lastConnectedWallet) {
                    walletToConnect = this.walletInArray(availableWallets, lastConnectedWallet?.name) || this.walletInArray(discoveryWallets, lastConnectedWallet?.name)
                    if (DEV) console.log("WALLET TO RECONNECT", walletToConnect)
                }
            }

            if (walletToConnect) WALLET = await this.connect(walletToConnect)

            if (DEV) console.log('WALLET res', WALLET)
            return WALLET
        } catch (error) {
            if (DEV) console.log('STARKNET WALLET TOOGLE ERROR', error)
        }
    }

    static async connect(WALLET: _starknetWallet) {
        let RESULT: _starknetWallet | undefined = undefined

        try {
            if (!WALLET.isConnected) {
                RESULT = await WALLET?.enable({ starknetVersion: "v5" })
            } else {
                console.log('WALL', WALLET)
                RESULT = WALLET
            }

            this.provider = RESULT
            this.connectedWallet = RESULT.selectedAddress

            store.commit('evm/setCollection', null)

            return RESULT
        } catch (error) {
            if (DEV) console.error('STARKNET WALLET CONNECT', error.message)
        }
    }

    static async disconnect(wallet: any) {

    }

    static async reconnect() {

    }

    static convertBigIntToUint(bigInt: bigint): Uint256 {
        return cairo.uint256(bigInt.toString())
    }

    static convertUintToBigInt(uint: Uint256): bigint {
        const high = BigInt(uint.high)
        const low = BigInt(uint.low)

        return (high << BigInt(128)) | low
    }

    static async checkBalance(provider: any, accountAddress: string) {
        const contract = new Contract(ABI_ETH, ETH_CONTRACT, provider)
        if (DEV) console.log('BALANCE contract', contract)

        const balanceInfo = await contract.balanceOf(accountAddress)

        if (DEV) console.log("Balance", balanceInfo?.balance)

        let balance = BigInt(0)
        if (balanceInfo?.balance) {
            balance = this.convertUintToBigInt(balanceInfo?.balance)
        }

        return balance
    }

    static async checkAllowance(provider: any, accountAddress: string, contractAddress: string) {
        const contract = new Contract(ABI_ETH, ETH_CONTRACT, provider)
        if (DEV) console.log('ALLOWANCE contract', contract)

        const allowanceInfo = await contract.allowance(accountAddress, contractAddress)

        if (DEV) console.log('ALLOWANCE RES', allowanceInfo)

        let allowance = BigInt(0)
        if (allowanceInfo?.remaining) {
            allowance = this.convertUintToBigInt(allowanceInfo?.remaining)
        }

        return allowance
    }

    static async approveMint(provider: any, contractAddress: string, mintFee: bigint): Promise<_starknetTx> {
        const contract = new Contract(ABI_ETH, ETH_CONTRACT, provider)
        if (DEV) console.log('APPROVE contract', contract)

        const approve = await contract.approve(contractAddress, this.convertBigIntToUint(mintFee))

        if (DEV) console.log('APPROVE RES', approve)
        return approve
    }

    static async mint(toast?: (message: string, data?: any) => void): Promise<TxResult> {
        try {
            if (DEV) console.log('Starknet Mint..')

            if (!this.isWalletConnected) {
                await this.toggleWallet()
            }

            // await Evm.setChainById()

            const selectedChain = store.getters['evm/selectedChain'
            ]
            const contractAddress = selectedChain.contract

            if (DEV) console.log(selectedChain, contractAddress)

            if (!this.provider || !this.isWalletConnected || !contractAddress) {
                if (DEV) console.log(!this.provider, !this.isWalletConnected, !contractAddress)

                return {
                    result: false,
                    msg: 'Something went wrong :(',
                }
            }

            const _provider = this.provider.account
            const _accountAddress = this.provider.account.address

            const contract = new Contract(ABI, contractAddress, this.provider.account)
            if (DEV) console.log('MINT contract', contract)

            const mintFee = await contract.getMintFee()
            if (DEV) console.log('mintFee', mintFee)


            const balance = await this.checkBalance(_provider, _accountAddress)

            if (DEV) console.log('BALANCE', balance)
            if (balance < mintFee) {
                if (DEV) console.log('Not enough funds to mint')
                return {
                    result: false,
                    msg: 'Not enough funds to mint',
                }
            }


            const allowance = await this.checkAllowance(_provider, _accountAddress, contractAddress)
            if (DEV) console.log('ALLOWANCE', allowance)

            if (allowance < mintFee) {
                const approve = await this.approveMint(_provider, contractAddress, mintFee)

                if (DEV) console.log('APPROVE', approve)
                if (toast) toast("Approve..", { id: selectedChain?.id, hash: approve?.transaction_hash })

                await _provider.waitForTransaction(approve?.transaction_hash)
            }

            const nextId = await contract.getNextMintId()
            if (DEV) console.log('NEXT ID', nextId, nextId.toString(), this.convertBigIntToUint(nextId), Number(nextId))


            const txResponse: _starknetTx = await contract.mint(Number(nextId))
            if (DEV) console.log('MINT', txResponse)
            if (toast) toast("Minting..", { id: selectedChain?.id, hash: txResponse?.transaction_hash })

            const receipt = await _provider.waitForTransaction(txResponse?.transaction_hash)

            if (DEV) {
                console.log('Mint confirmed:', receipt)
            }

            return {
                result: receipt.execution_status === 'SUCCEEDED',
                msg: receipt.execution_status === 'SUCCEEDED' ? 'Successful Mint' : 'Mint not confirmed', // (receipt.status == null ? 'Mint not confirmed' : 'Mint Failed'
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

    static async collection() { // *
        try {
            const _accountAddress = this.provider.account.address

            const contractAddress = Config.getChainByName('starknet')?.contract || ''
            const contract = new Contract(ABI, contractAddress, this.provider.account)

            const ITEMS = []

            try {
                const tokensCount = await contract.balance_of(_accountAddress)
                for (let i = 0; i < tokensCount; i++) {
                    const id = Number(await contract.tokenOfOwnerByIndex(owner, i))
                    const uri = Config.getIpfsUri(id)

                    const item = { chainId: null, id, uri }
                    ITEMS.push(item)

                    // yield item
                }

                ITEMS.push(ITEMS)
            } catch (error) {
                if (DEV) console.error('Starknet Error fetch:', error)
            }

            return ITEMS.flat().sort((a, b) => a.id - b.id)
        } catch (error) {
            if (DEV) {
                console.error('Error fetching collection:', error)
            }

            return []
        }
    }
}