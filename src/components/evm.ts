import { Ref } from 'vue'
import { ethers } from 'ethers'
import { useOnboard } from '@web3-onboard/vue'

import store from '@/store'

import Zerius, { ChainType } from './config'
import ABI from '@/assets/ABI.json'

interface TxResult {
    result: boolean;
    msg?: string;
    receipt?: any;
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

    static async mint(): Promise<TxResult> {
        try {
            const selectedChain = store.getters['wallet/selectedChain']
            const contractAddress = Zerius.getContractForChain(selectedChain.id)

            if (!this.isWalletConnected) {
                // this.toggleWallet()
            }

            if (!window.ethereum || !this.isWalletConnected || !contractAddress) {
                return {
                    result: false,
                    msg: 'Error',
                }
            }
            const web3 = window.ethereum

            const provider = new ethers.BrowserProvider(web3)
            const signer = await provider.getSigner()

            const contract = new ethers.Contract(contractAddress, ABI, signer)

            const transaction = await contract.mint()
            const receipt = await transaction.wait()

            if (Zerius.isDEV) {
                console.log('Minting successful:', receipt)
            }

            return {
                result: receipt.status === 1,
                msg: receipt.status === 1 ? 'Successful Mint' : 'Mint Failed',
                receipt
            }
        } catch (error) {
            if (Zerius.isDEV) {
                console.error('Error minting NFT:', error)
            }

            return {
                result: false,
                msg: 'Mint Failed'
            }
        }
    }

    static async bridge(tokenId: number, chainId: number, toChain: number): Promise<TxResult> {
        const LZ_VERSION = 1
        const GAS_MULTIPLY = BigInt(3)

        const abiCoder = ethers.AbiCoder.defaultAbiCoder()

        if (Zerius.isDEV) toChain = chainId === 84531 ? 80001 : 84531

        try {
            // console.log('BRIDGE', 'id', tokenId, 'from chain', chainId, 'to', toChain)
            //////////// CHECK ////////////
            const selectedChain = store.getters['wallet/selectedChain']
            // console.log('selectedChain', selectedChain)
            if (selectedChain.id != chainId) await this.switchChain(chainId)

            const _dstChainId = Zerius.getLzChain(toChain)

            const contractAddress = Zerius.getContractForChain(selectedChain.id)

            if (!window.ethereum || !this.isWalletConnected || !contractAddress || !_dstChainId) {
                if (Zerius.isDEV) {
                    console.error('Invalid configuration for bridge',
                        !window.ethereum, !this.isWalletConnected, contractAddress, _dstChainId)
                }

                return {
                    result: false,
                    msg: 'Error',
                }
            }
            //////////// INIT ////////////
            const web3 = window.ethereum
            const provider = new ethers.BrowserProvider(web3)

            const signer = await provider.getSigner()
            const sender = await signer.getAddress()
            const _toAddress = ethers.hexlify(ethers.toUtf8Bytes(sender))

            const contract = new ethers.Contract(contractAddress, ABI, signer)
            //////////// PREPARE ////////////
            const BRIDGE_FEE = await contract.bridgeFee()
            const MIN_GAS_TO_TRANSFER = BigInt(250000) // await contract.minGasToTransferAndStore()
            const adapterParams = ethers.solidityPacked(
                ["uint16", "uint256"],
                [LZ_VERSION, MIN_GAS_TO_TRANSFER]
            )
            // console.log('adapterParams', adapterParams)

            // console.log('MIN_GAS_TO_TRANSFER', MIN_GAS_TO_TRANSFER)
            // console.log('BRIDGE_FEE', BRIDGE_FEE)
            // console.log(
            //     LZ_VERSION,
            //     MIN_GAS_TO_TRANSFER,
            //     tokenId,
            //     _toAddress,
            //     _dstChainId
            // )
            // console.log(abiCoder.encode(['uint16', 'uint256'], [LZ_VERSION, MIN_GAS_TO_TRANSFER]))
            const { nativeFee } = await contract.estimateSendFee(
                _dstChainId,
                _toAddress,
                tokenId,
                false,
                adapterParams
            )
            // console.log('nativeFee', nativeFee)
            //  nativeFee + minGasToTransferAndStore * 2
            const TOTAL_COST = nativeFee + BRIDGE_FEE + MIN_GAS_TO_TRANSFER * GAS_MULTIPLY
            // console.log('TOTAL_COST', TOTAL_COST)

            //////////// CHECK BALANCE ////////////
            const userBalance = await provider.getBalance(sender)
            // console.log('userBalance', userBalance)
            if (userBalance < TOTAL_COST) {
                return {
                    result: false,
                    msg: 'Not enough funds to bridge',
                }
            }

            //////////// BRIDGE ////////////
            const transaction = await contract.sendFrom(
                sender,
                _dstChainId,
                _toAddress,
                tokenId,
                sender,
                ethers.ZeroAddress,
                adapterParams,
                { value: TOTAL_COST }
            )

            const receipt = await transaction.wait()

            if (Zerius.isDEV) {
                console.log('Bridge successful:', receipt)
            }

            return {
                result: receipt.status === 1,
                msg: receipt.status === 1 ? 'Successful Bridge' : 'Bridge failed',
                receipt
            }
        } catch (error) {
            if (Zerius.isDEV) {
                console.error('Error bridging NFT:', error);
            }

            return {
                result: false,
                msg: 'Bridge failed',
            }
        }
    }

    static async isTransactionConfirmed(provider: any, txHash: string, requiredConfirmations = 6) {
        const receipt = await provider.getTransactionReceipt(txHash);
        return receipt && receipt.confirmations >= requiredConfirmations && receipt.status === 1;
    }

    static async waitForConfirmation(provider: any, txHash: string, retries = 3, delay = 5000) {
        let attempts = 0;

        const attemptCheck = async (resolve: (arg0: boolean) => any, reject: (arg0: Error) => any) => {
            if (attempts >= retries) {
                return reject(new Error('Transaction not confirmed after maximum retries.'));
            }

            const confirmed = await this.isTransactionConfirmed(provider, txHash);
            if (confirmed) {
                return resolve(true);
            }

            attempts += 1;
            setTimeout(() => attemptCheck(resolve, reject), delay);
        };

        return new Promise(attemptCheck);
    }

    static async getUri(chainId: number, tokenId: number, hash: string) {
        try {
            if (Zerius.isDEV) {
                console.log('getUri', chainId, tokenId)
            }

            const contractAddress = Zerius.getContractForChain(chainId)

            if (!window.ethereum || !this.isWalletConnected || !contractAddress) return
            const web3 = window.ethereum

            const provider = new ethers.BrowserProvider(web3)
            const signer = await provider.getSigner()
            const owner = await signer.getAddress()

            const result = await this.waitForConfirmation(provider, hash)
            if (!result) {
                if (Zerius.isDEV) {
                    console.log('getUri tx still not confirmed', chainId, tokenId, hash)
                }

                return ''
            }

            const contract = new ethers.Contract(contractAddress, ABI, signer)

            const id = Number(await contract.tokenOfOwnerByIndex(owner, tokenId))
            const uri = await contract.tokenURI(id)

            return uri
        } catch (error) {
            if (Zerius.isDEV) {
                console.error('Error fetching Uri:', error)
            }

            return ''
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
            if (!window.ethereum || !this.isWalletConnected) return
            const web3 = window.ethereum

            const provider = new ethers.BrowserProvider(web3)
            const signer = await provider.getSigner()
            const owner = await signer.getAddress()

            const ITEMS = []

            for (const [chainId, contractAddress] of Object.entries(Zerius.contracts)) {
                if (Zerius.isDEV) console.log(chainId, contractAddress)

                // const provider = new ethers.JsonRpcProvider(Zerius.getChainById(chainId).rpcUrl)
                // const signer = await provider.getSigner()
                // const owner = await signer.getAddress()
                try {
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
                } catch (error) {
                    if (Zerius.isDEV) {
                        console.error('Error fetch:', chainId, error)
                    }
                }
            }

            return ITEMS.flat().sort((a, b) => a.id - b.id)
        } catch (error) {
            if (Zerius.isDEV) {
                console.error('Error fetching collection:', error)
            }

            return []
        }
    }
}
