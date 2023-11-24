import { cairo, CallData, Contract, Uint256 } from "starknet"
import * as StarknetCore from "get-starknet-core"

import store from '@/store'

import Config from '@/controllers/config'
import { TxResult } from './evm.js'

import ABI from '@/assets/ABI/starknet.json'
import ABI_ETH from '@/assets/ABI/starknet_eth.json'

const DEV = import.meta.env.DEV
const LOG = false

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
        if (DEV && LOG) console.log('STARKNET WALLET TOOGLE', walletType)

        let WALLET: _starknetWallet | undefined = undefined

        try {
            const discoveryWallets = await StarknetCore.default.getDiscoveryWallets()
            const availableWallets = await StarknetCore.default.getAvailableWallets()

            if (DEV && LOG) console.log('discoveryWallets', discoveryWallets)
            if (DEV && LOG) console.log('availableWallets', availableWallets)

            const lastConnectedWallet = await StarknetCore.default.getLastConnectedWallet()
            if (DEV && LOG) console.log('lastConnectedWallet', lastConnectedWallet)

            let walletToConnect = undefined

            if (walletType) {
                walletToConnect = this.walletInArray(availableWallets, walletType) || this.walletInArray(discoveryWallets, walletType)
            }

            if (!walletType) {
                if (availableWallets && lastConnectedWallet) {
                    walletToConnect = this.walletInArray(availableWallets, lastConnectedWallet?.name) || this.walletInArray(discoveryWallets, lastConnectedWallet?.name)
                    if (DEV && LOG) console.log("WALLET TO RECONNECT", walletToConnect)
                }
            }

            if (walletToConnect) WALLET = await this.connect(walletToConnect)

            if (DEV && LOG) console.log('WALLET RES', WALLET)
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
                if (DEV && LOG) console.log('STARKNET CONNECT', WALLET)
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
        if (DEV && LOG) console.log('BALANCE contract', contract)

        const balanceInfo = await contract.balanceOf(accountAddress)

        if (DEV && LOG) console.log("Balance", balanceInfo?.balance)

        let balance = BigInt(0)
        if (balanceInfo?.balance) {
            balance = this.convertUintToBigInt(balanceInfo?.balance)
        }

        return balance
    }

    static async checkAllowance(provider: any, accountAddress: string, contractAddress: string) {
        const contract = new Contract(ABI_ETH, ETH_CONTRACT, provider)
        if (DEV && LOG) console.log('ALLOWANCE contract', contract)

        const allowanceInfo = await contract.allowance(accountAddress, contractAddress)

        if (DEV && LOG) console.log('ALLOWANCE RES', allowanceInfo)

        let allowance = BigInt(0)
        if (allowanceInfo?.remaining) {
            allowance = this.convertUintToBigInt(allowanceInfo?.remaining)
        }

        return allowance
    }

    static async approveMint(provider: any, contractAddress: string, mintFee: bigint): Promise<_starknetTx> {
        const contract = new Contract(ABI_ETH, ETH_CONTRACT, provider)
        if (DEV && LOG) console.log('APPROVE contract', contract)

        const approve = await contract.approve(contractAddress, this.convertBigIntToUint(mintFee))

        if (DEV && LOG) console.log('APPROVE RES', approve)
        return approve
    }

    static async mint(toast?: (message: string, data?: any) => void): Promise<TxResult> {
        try {
            if (DEV) console.log('Starknet Mint..');

            if (!this.isWalletConnected) {
                await this.toggleWallet();
            }

            const selectedChain = store.getters['evm/selectedChain'];
            const contractAddress = selectedChain.contract;

            if (!this.provider || !this.isWalletConnected || !contractAddress) {
                return {
                    result: false,
                    msg: 'Something went wrong :(',
                }
            }

            const _provider = this.provider.account;
            const _accountAddress = this.provider.account.address;

            const contract = new Contract(ABI, contractAddress, this.provider.account);
            const mintFee = await contract.getMintFee()
            const nextId = await contract.getNextMintId()

            const balance = await this.checkBalance(_provider, _accountAddress);
            if (balance < mintFee) {
                return {
                    result: false,
                    msg: 'Not enough funds to mint',
                }
            }

            const multiCall = await _provider.execute([
                {
                    contractAddress: ETH_CONTRACT,
                    entrypoint: "approve",
                    calldata: CallData.compile({
                        spender: contractAddress,
                        amount: cairo.uint256(mintFee),
                    }),
                },
                {
                    contractAddress: contractAddress,
                    entrypoint: "mint",
                    calldata: CallData.compile({
                        uri: nextId
                    })
                }
            ])

            if (DEV) console.log('Multi-Call Response:', multiCall);
            if (toast) toast("Minting..", { id: selectedChain?.id, hash: multiCall?.transaction_hash });

            const receipt = await _provider.waitForTransaction(multiCall?.transaction_hash)
            if (DEV) {
                console.log('Mint confirmed:', receipt)
            }

            return {
                result: receipt.execution_status === 'SUCCEEDED',
                msg: receipt.execution_status === 'SUCCEEDED' ? 'Successful Mint' : 'Mint not confirmed',
                receipt,
            };
        } catch (error) {
            if (DEV) console.error('Error in multi-call minting:', error);
            return {
                result: false,
                msg: 'Mint Failed',
            };
        }
    }
}