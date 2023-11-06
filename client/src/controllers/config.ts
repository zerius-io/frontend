import store from '@/store'

export interface _CHAIN {
    id: number
    token: string
    label: string
    rpcUrl: string
    icon?: string
    explorer: string
    lzChain: number
    contract: string

    testnet?: boolean
    block?: number[]
    new?: boolean
    hide?: boolean
}

export type ChainConnect = {
    id: any,
    token: string,
    label: string,
    rpcUrl: string,
    icon: string,
    blockExplorerUrl: string,
}

export default class Config {
    static get data() {
        return store.state.config
    }

    static get chains(): _CHAIN[] {
        return this.data.config.chains
    }

    static get ipfs() {
        return this.data.config.ipfs
    }

    static get chainsConnect(): ChainConnect[] {
        return this.chains
            .filter((chain: _CHAIN) => {
                return chain.id !== null
            })
            .map((chain: _CHAIN) => ({
                id: chain.id,
                token: chain.token,
                label: chain.label,
                rpcUrl: chain.rpcUrl,
                icon: chain?.icon || `${chain.label.toLowerCase()}.svg`,
                blockExplorerUrl: chain.explorer
            }))
    }

    static getChainById(chainId: number) {
        return this.chains.find(chain => chain.id == chainId)
    }

    static getChainByName(chainName: string) {
        return this.chains.find(chain => chain.label.toLowerCase() == chainName.toLowerCase())
    }

    static getExplorerTxUrl(explorer: { id: number, hash: string }): string {
        let chain: _CHAIN;

        // TODO REMOVE AFTER REWORK
        if (explorer.id == null) {
            chain = this.getChainByName('Starknet')
        }
        chain = this.getChainById(explorer.id)

        return chain.explorer ? `${chain.explorer}/tx/${explorer.hash}` : ''
    }

    static getIpfsUri(id: number): string {
        for (const key in this.ipfs) {
            const [start, end] = key.split('-').map(Number)
            if (id >= start && id <= end) {
                return `${this.ipfs[key].url}${id}.png`
            }
        }

        return ''
    }
}