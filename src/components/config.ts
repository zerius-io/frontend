export type ChainType = {
    id: any,
    token: string,
    label: string,
    rpcUrl: string,
    icon?: string
}

const chains: ChainType[] = [
    {
        id: 80001,
        token: 'MATIC',
        label: 'Mumbai',
        rpcUrl: 'https://polygon-mumbai-bor.publicnode.com',
        icon: 'polygon.svg'
    },
    {
        id: 1,
        token: 'ETH',
        label: 'Ethereum',
        rpcUrl: 'https://rpc.ankr.com/eth'
    },
    {
        id: 324,
        token: 'ETH',
        label: 'zkSync',
        rpcUrl: 'https://mainnet.era.zksync.io'
    },
    {
        id: 42161,
        token: 'ETH',
        label: 'Arbitrum One',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        icon: 'arbitrum.svg'
    },
    {
        id: 10,
        token: 'ETH',
        label: 'Optimism',
        rpcUrl: 'https://rpc.ankr.com/optimism'
    },
    {
        id: 137,
        token: 'MATIC',
        label: 'Polygon',
        rpcUrl: 'https://rpc.ankr.com/polygon'
    },
    {
        id: 56,
        token: 'BNB',
        label: 'BNB Chain',
        rpcUrl: 'https://rpc.ankr.com/bsc',
        icon: 'bnb.svg'
    },
    {
        id: 43114,
        token: 'AVAX',
        label: 'Avalanche',
        rpcUrl: 'https://rpc.ankr.com/avalanche'
    },
    {
        id: 8453,
        token: 'ETH',
        label: 'Base',
        rpcUrl: 'https://mainnet.base.org'
    },
    {
        id: 7777777,
        token: 'ETH',
        label: 'Zora',
        rpcUrl: 'https://rpc.zora.energy'
    }
]

const lzChains = {
    1: 101,
    56: 102,
    43114: 106,
    42161: 110,
    8453: 184,
    80001: 10109,
    84531: 10160
}

const contracts: Record<number, string> = {
    // polygon mumbai
    80001: '0x75023ffe91dd4d67D0Ce5a4b0C376aa22708f1Fb',
    // base goerli
    84531: '0x23e196CC4652bc272F80c04362a30b3db87F2cB9'
}

export default class Zerius {
    static get chains() {
        return chains
    }

    static getChainById(chainId: number) {
        return this.chains.find(chain => chain.id == chainId)
    }

    static get lzChains() {
        return lzChains
    }

    static get contracts() {
        return contracts
    }

    static getAllContracts() {
        return this.contracts
    }

    static getContractForChain(chainId: number): string {
        return this.contracts[chainId]
    }
}


export { chains, lzChains, contracts }