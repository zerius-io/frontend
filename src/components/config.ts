const DEV = import.meta.env.DEV // DEV=TRUE

export type ChainType = {
    id: any,
    token: string,
    label: string,
    rpcUrl: string,
    icon?: string,
    blockExplorerUrl?: string,
}

const chains: ChainType[] = [
    {
        id: 1,
        token: 'ETH',
        label: 'Ethereum',
        rpcUrl: 'https://rpc.ankr.com/eth',
    },
    // {
    //     id: 324,
    //     token: 'ETH',
    //     label: 'zkSync',
    //     rpcUrl: 'https://mainnet.era.zksync.io'
    // },
    {
        id: 42161,
        token: 'ETH',
        label: 'Arbitrum One',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        icon: 'arbitrum.svg'
    },
    {
        id: 534352,
        token: 'ETH',
        label: 'Scroll',
        rpcUrl: 'https://scroll.blockpi.network/v1/rpc/public',
        icon: 'scroll.png'
    },
    {
        id: 10,
        token: 'ETH',
        label: 'Optimism',
        rpcUrl: 'https://rpc.ankr.com/optimism'
    },
    {
        id: 8453,
        token: 'ETH',
        label: 'Base',
        rpcUrl: 'https://mainnet.base.org'
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
        id: 7777777,
        token: 'ETH',
        label: 'Zora',
        rpcUrl: 'https://rpc.zora.energy'
    }
]
if (DEV) {
    chains.unshift(
        {
            id: 80001,
            token: 'MATIC',
            label: 'Mumbai',
            rpcUrl: 'https://polygon-mumbai-bor.publicnode.com',
            icon: 'polygon.svg'
        },
        {
            id: 84531,
            token: 'ETH',
            label: 'Base Goreli',
            rpcUrl: 'https://base-goerli.publicnode.com',
            icon: 'base.svg'
        }
    )
}

const lzChains: Record<number, number> = {
    1: 101, // Ethereum
    324: 165,// zkSync Era
    42161: 110, // Arbitrum
    10: 111,// Optimism
    8453: 184, // Base
    137: 109,// Polygon
    56: 102, // BNB Chain
    43114: 106, // Avalanche
    7777777: 195, // Zora
    534352: 214,// Scroll
    // Testnets
    80001: 10109, // Polygon Mumbai
    84531: 10160 // Base Goerli
}

const contracts: Record<number, string> = {
    1: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41', // Ethereum
    324: '', // zkSync Era
    42161: '0x250c34D06857b9C0A036d44F86d2c1Abe514B3Da', // Arbitrum
    10: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41',// Optimism
    8453: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41', // Base
    137: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41',// Polygon
    56: '0x250c34D06857b9C0A036d44F86d2c1Abe514B3Da', // BNB Chain
    43114: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41', // Avalanche
    7777777: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41', // Zora
    534352: '0xEB22C3e221080eAD305CAE5f37F0753970d973Cd', // Scroll
    // Testnets
    80001: '0x75023ffe91dd4d67D0Ce5a4b0C376aa22708f1Fb', // Polygon Mumbai
    84531: '0x23e196CC4652bc272F80c04362a30b3db87F2cB9'  // Base Goerli
}

const explorers: Record<number, string> = {
    1: 'https://etherscan.io', // Ethereum
    324: 'https://explorer.zksync.io',// zkSync Era
    42161: 'https://arbiscan.io', // Arbitrum
    10: 'https://optimistic.etherscan.io',// Optimism
    8453: 'https://basescan.org', // Base
    137: 'https://polygonscan.com',// Polygon
    56: 'https://bscscan.com', // BNB Chain
    43114: 'https://snowtrace.io', // Avalanche
    534352: 'https://scrollscan.com', // Scroll
    7777777: 'https://explorer.zora.energy/', // Zora
    80001: 'https://mumbai.polygonscan.com/', // Polygon Mumbai
    84531: 'https://goerli.basescan.org/'  // Base Goerli
}

const ipfs: Record<string, string> = {
    '1-500000': 'https://zerius.mypinata.cloud/ipfs/QmX7mjWT8wSe2kehgnGJbsyokwfeCF3oiNDp5HKhkmFdwK/', // Ethereum
    '1000001-1500000': 'https://zerius.mypinata.cloud/ipfs/QmNWKAgfo1BqMhWLK4gFMtmnhoLxQtq7rHefKkYUZRu1WR/',// Arbitrum
    '1500001-2000000': 'https://zerius.mypinata.cloud/ipfs/QmduZF1HCVTwdu4wg6gPDC9zPKTp1Uh8ueuFwg98bW2ZXL/', // Optimsim
    '2000001-2500000': 'https://zerius.mypinata.cloud/ipfs/QmaLg3ZY5B3dkG2t2FBRHucg6jS2Puuc52eEN6UyuR4cbM/', // Polygon
    '2500001-3000000': 'https://zerius.mypinata.cloud/ipfs/QmSugq1BqHGSQpjvepAbzVjN65MYt4dCJP1RaTpiF3jYwu/', // BSC
    '3000001-3500000': 'https://zerius.mypinata.cloud/ipfs/QmPxCcPqe8Td6ZM9qwFQoEG73XYoP4soghSCPUM7c8R5EM/', // Avalanche
    '3500001-4000000': 'https://zerius.mypinata.cloud/ipfs/QmU1QQ6ZyNTXkswH3iZ71ZWyjiPtcEFiE9xqtrgpwi7ugF/', // Base
    '4000001-4500000': 'https://zerius.mypinata.cloud/ipfs/QmbfPtdUTT28P5NLzcWVhQT36vtCUr6wYaZ2cqWcYGpPHu/', // Zora
    '4500001-4510000': 'https://zerius.mypinata.cloud/ipfs/QmSLVADeLBE4RNXfGZF7oweKL1oacGFxPqKeJnn7iMBJWU/' // Scroll
}

const blockers: Record<number, number[]> = {
    7777777: [56, 43114, 534352],
    56: [7777777],
    43114: [7777777],
    534352: [7777777, 8453],
    8453: [534352]
}

export default class Zerius {
    static get chains() {
        return chains
    }

    static get isDEV() {
        return DEV
    }

    static getChainById(chainId: number) {
        return this.chains.find(chain => chain.id == chainId)
    }

    static get lzChains() {
        return lzChains
    }

    static getLzChain(id: number) {
        return lzChains[id]
    }

    static get contracts() {
        return contracts
    }

    static getContractForChain(id: number): string {
        return this.contracts[id]
    }

    static getExplorer(id: number): string {
        return explorers[id]
    }

    static getExplorerTxUrl(explorer: { id: number, hash: string }): string {
        const explorerURL = this.getExplorer(explorer.id)
        return explorerURL ? `${explorerURL}/tx/${explorer.hash}` : ''
    }

    static getIpfsUri(id: number): string {
        for (const key in ipfs) {
            const [start, end] = key.split('-').map(Number);
            if (id >= start && id <= end) {
                return `${ipfs[key]}${id}.png`
            }
        }

        return ''
    }

    static chainsBlock(chainId: number): number[] {
        return blockers[chainId] || []
    }
}


export { chains, lzChains, contracts }