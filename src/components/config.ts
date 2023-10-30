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
    {
        id: 42161,
        token: 'ETH',
        label: 'Arbitrum One',
        rpcUrl: 'https://arb1.arbitrum.io/rpc',
        icon: 'arbitrum.svg'
    },
    {
        id: 324,
        token: 'ETH',
        label: 'zkSync',
        rpcUrl: 'https://mainnet.era.zksync.io'
    },
    {
        id: 8453,
        token: 'ETH',
        label: 'Base',
        rpcUrl: 'https://mainnet.base.org'
    },
    {
        id: 250,
        token: 'FTM',
        label: 'Fantom',
        rpcUrl: 'https://rpcapi.fantom.network',
    },
    {
        id: 1101,
        token: 'ETH',
        label: 'Poly zkEVM',
        rpcUrl: 'https://zkevm-rpc.com',
        icon: 'zkevm.svg',
    },
    // {
    //     id: 1088,
    //     token: 'METIS',
    //     label: 'Metis',
    //     rpcUrl: 'https://metis-mainnet.public.blastapi.io',
    // },
    // {
    //     id: 1284,
    //     token: 'GLMR',
    //     label: 'Moonbeam',
    //     rpcUrl: 'https://moonbeam.publicnode.com',
    // },
    {
        id: 1116,
        token: 'CORE',
        label: 'Core',
        rpcUrl: 'https://rpc.coredao.org',
    },
    {
        id: 42220,
        token: 'CELO',
        label: 'Celo',
        rpcUrl: 'https://forno.celo.org',
    },
    {
        id: 1666600000,
        token: 'ONE',
        label: 'Harmony',
        rpcUrl: 'https://api.harmony.one',
    },
    {
        id: 7700,
        token: 'CANTO',
        label: 'Canto',
        rpcUrl: 'https://canto.gravitychain.io',
    },
    {
        id: 59144,
        token: 'ETH',
        label: 'Linea',
        rpcUrl: 'https://linea.drpc.org'
    },
    {
        id: 42170,
        token: 'ETH',
        label: 'Nova',
        rpcUrl: 'https://arbitrum-nova.drpc.org',
        icon: 'nova.svg',
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
        id: 7777777,
        token: 'ETH',
        label: 'Zora',
        rpcUrl: 'https://rpc.zora.energy'
    },
    {
        id: 534352,
        token: 'ETH',
        label: 'Scroll',
        rpcUrl: 'https://scroll.blockpi.network/v1/rpc/public',
        icon: 'scroll.png'
    },
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
    42170: 175, // Arbitrum Nova
    59144: 183, // Linea
    250: 112, //Fantom
    1101: 158, // Polygon zkEVM
    // 1088: 151, // Metis
    // 1284: 126, // Moonbeam
    1116: 153, // Core
    42220: 125, // Celo
    1666600000: 116, // Harmony
    7700: 159, // Canto

    // Testnets
    80001: 10109, // Polygon Mumbai
    84531: 10160, // Base Goerli
}

const contracts: Record<number, string> = {
    1: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41', // Ethereum
    324: '0x7da50bd0fb3c2e868069d9271a2aeb7ed943c2d6', // zkSync Era
    42161: '0x250c34D06857b9C0A036d44F86d2c1Abe514B3Da', // Arbitrum
    10: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41',// Optimism
    8453: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41', // Base
    137: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41',// Polygon
    56: '0x250c34D06857b9C0A036d44F86d2c1Abe514B3Da', // BNB Chain
    43114: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41', // Avalanche
    7777777: '0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41', // Zora
    534352: '0xEB22C3e221080eAD305CAE5f37F0753970d973Cd', // Scroll
    42170: '0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7', // Arbitrum Nova
    59144: '0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7', // Linea
    250: '0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7', // Fantom
    1101: '0x4c5AeDA35d8F0F7b67d6EB547eAB1df75aA23Eaf', // Polygon zkEVM
    // 1088: '0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7', // Metis
    // 1284: '0x4c5aeda35d8f0f7b67d6eb547eab1df75aa23eaf', // Moonbeam
    1116: '0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7', // Core
    42220: '0x4c5aeda35d8f0f7b67d6eb547eab1df75aa23eaf', // Celo
    1666600000: '0x5188368a92b49f30f4cf9bef64635bcf8459c7a7', // Harmony
    7700: '0x5188368a92b49f30f4cf9bef64635bcf8459c7a7', // Canto

    // Testnets
    80001: '0x75023ffe91dd4d67D0Ce5a4b0C376aa22708f1Fb', // Polygon Mumbai
    84531: '0x23e196CC4652bc272F80c04362a30b3db87F2cB9',  // Base Goerli
}

const explorers: Record<number, string> = {
    1: 'https://etherscan.io', // Ethereum
    324: 'https://explorer.zksync.io', // zkSync Era
    42161: 'https://arbiscan.io', // Arbitrum
    10: 'https://optimistic.etherscan.io',// Optimism
    8453: 'https://basescan.org', // Base
    137: 'https://polygonscan.com',// Polygon
    56: 'https://bscscan.com', // BNB Chain
    43114: 'https://snowtrace.io', // Avalanche
    534352: 'https://scrollscan.com', // Scroll
    7777777: 'https://explorer.zora.energy/', // Zora
    42170: 'https://nova.arbiscan.io/', // Arbitrum Nova
    59144: 'https://lineascan.build/', // Linea
    250: 'https://ftmscan.com/', // Fantom
    1101: 'https://zkevm.polygonscan.com/', // Polygon zkEVM
    // 1088: 'https://andromeda-explorer.metis.io/', // Metis
    // 1284: 'https://moonscan.io/', // Moonbeam
    1116: 'https://scan.coredao.org/', // Core
    42220: 'https://celoscan.io/', // Celo
    1666600000: 'https://explorer.harmony.one/', // Harmony
    7700: 'https://cantoscan.com/', // Canto

    //Testnets
    80001: 'https://mumbai.polygonscan.com/', // Polygon Mumbai
    84531: 'https://goerli.basescan.org/'  // Base Goerli
}

const ipfs: Record<string, string> = {
    '1-500000': 'https://zerius.mypinata.cloud/ipfs/QmX7mjWT8wSe2kehgnGJbsyokwfeCF3oiNDp5HKhkmFdwK/', // Ethereum
    '500001-1000000': 'https://zerius.mypinata.cloud/ipfs/QmXZxnwDscfX2cELzuWsbyDYujzaTv9pKWFnzGNokWoQ26/', // zkSync Era
    '1000001-1500000': 'https://zerius.mypinata.cloud/ipfs/QmNWKAgfo1BqMhWLK4gFMtmnhoLxQtq7rHefKkYUZRu1WR/',// Arbitrum
    '1500001-2000000': 'https://zerius.mypinata.cloud/ipfs/QmduZF1HCVTwdu4wg6gPDC9zPKTp1Uh8ueuFwg98bW2ZXL/', // Optimsim
    '2000001-2500000': 'https://zerius.mypinata.cloud/ipfs/QmaLg3ZY5B3dkG2t2FBRHucg6jS2Puuc52eEN6UyuR4cbM/', // Polygon
    '2500001-3000000': 'https://zerius.mypinata.cloud/ipfs/QmSugq1BqHGSQpjvepAbzVjN65MYt4dCJP1RaTpiF3jYwu/', // BSC
    '3000001-3500000': 'https://zerius.mypinata.cloud/ipfs/QmPxCcPqe8Td6ZM9qwFQoEG73XYoP4soghSCPUM7c8R5EM/', // Avalanche
    '3500001-4000000': 'https://zerius.mypinata.cloud/ipfs/QmU1QQ6ZyNTXkswH3iZ71ZWyjiPtcEFiE9xqtrgpwi7ugF/', // Base
    '4000001-4500000': 'https://zerius.mypinata.cloud/ipfs/QmbfPtdUTT28P5NLzcWVhQT36vtCUr6wYaZ2cqWcYGpPHu/', // Zora
    '4500001-4510000': 'https://zerius.mypinata.cloud/ipfs/QmaGzVQdLxY4LuCxPsfvXm1ZKBir7VRcdrjKUcG1MG3xW5/', // Scroll
    '5000001-5010000': 'https://zerius.mypinata.cloud/ipfs/QmctFRSdyPAe8Zc63TraPvgMYgbkNHm4UjVxnaMEmUaoiP/', // Linea
    // '5500001-6000000': 'https://zerius.mypinata.cloud/ipfs/QmctFRSdyPAe8Zc63TraPvgMYgbkNHm4UjVxnaMEmUaoiP/', // Moonbeam
    '6000001-6010001': 'https://zerius.mypinata.cloud/ipfs/QmVLWcGhjArxLYpzS74ebBAuEhoSDwPhac886Qp3D7CaZ9/', // Core
    '6500001-7000000': 'https://zerius.mypinata.cloud/ipfs/QmXBCdqM5b5H8Ce7mhE7x7TimpxNefqWtZ3MeTEnpNvZNF/', // Celo
    '7000001-7500000': 'https://zerius.mypinata.cloud/ipfs/QmabUkjcfMNTWLT4B8drCrcKq8TvMTz5puRYhsW9JDL7uc/', // Harmony
    '7500001-8000000': 'https://zerius.mypinata.cloud/ipfs/QmX4DoshTordg7EJVsdYwqTAxyYm19vFKdKxzxWrdmDmtH/', // Canto
    '8000001-8500001': 'https://zerius.mypinata.cloud/ipfs/QmeHKzL9Uj989WPfAx5MH7PfsuzMwue1b7ZhcC517fdiLG/', // Polygon zkEVM
    '8500001-8510000': 'https://zerius.mypinata.cloud/ipfs/QmQKgMFFykh9dchK419gxz337PwjhUKHN5MH6kRFW6e6dn/', // Fantom
    '9000001-9500000': 'https://zerius.mypinata.cloud/ipfs/QmX7mjWT8wSe2kehgnGJbsyokwfeCF3oiNDp5HKhkmFdwK/', // Canto
    '9500001-9530000': 'https://zerius.mypinata.cloud/ipfs/QmUMCWhMmTjsKPRP8JpcPsstrTw3ujPDfbsw7m64C4ewQM/', // Arbitrum Nova 1pt
    '9530001-9550000': 'https://zerius.mypinata.cloud/ipfs/Qmb9dEBxYHstLzZMd7ExLGAgXug1yHqvriNMGsUon3RMYP/', // Arbitrum Nova 2pt
    '9550001-9580000': 'https://zerius.mypinata.cloud/ipfs/QmNTcWiLpoDhU4gp1GmrzrcBxqrqrWkqWe8osYdpAyshxA/', // Arbitrum Nova 3pt
    '9580001-9600000': 'https://zerius.mypinata.cloud/ipfs/QmRv7at5iXTfWV514ozRhVa3ReLKD4st3FCGiEopfuNvyu/', // Arbitrum Nova 4pt
    // '10000001-10010001': 'https://zerius.mypinata.cloud/ipfs/QmaGzVQdLxY4LuCxPsfvXm1ZKBir7VRcdrjKUcG1MG3xW5/', // Metis
}

const blockers: Record<number, number[]> = {
    7777777: [56, 43114, 534352, 250, 42170, 59144, 324, 1101, 1088, 1284, 1116, 42220, 7700, 7777777], // Zora
    56: [7777777, 56], // BSC
    43114: [7777777, 43114], // Avalanche
    534352: [7777777, 8453, 250, 42170, 59144, 1101, 1088, 1284, 1116, 42220, 7700, 534352], // Scroll
    8453: [534352, 1116, 42220, 7700, 8453], // Base
    324: [7777777, 534352, 1088, 1284, 1116, 42220, 324], //zkSync
    59144: [534352, 7777777, 42170, 1284, 1116, 42220, 7700, 59144], // Linea
    42170: [7777777, 534352, 59144, 1101, 1116, 42220, 42170], // Arbitrum Nova
    250: [7777777, 534352, 1116, 1666600000, 250], // Fantom,
    1101: [7777777, 534352, 42170, 1284, 1116, 1666600000, 7700, 1101], // Polygon zkEVM
    // 1088: [7777777, 534352, 324, 1284, 1116, 42220, 1666600000], // Metis
    // 1284: [1101, 1088, 7777777, 534352, 324, 59144, 1116, 42220, 7700], // Moonbeam
    1116: [1101, 1088, 1284, 7777777, 534352, 8453, 324, 59144, 42170, 250, 42220, 1666600000, 7700, 1116, 42220], // Core
    42220: [1088, 1284, 1284, 7777777, 534352, 8453, 324, 59144, 42170, 1666600000, 7700, 42220, 1116], // Celo
    1666600000: [1101, 1088, 7777777, 8453, 324, 59144, 42170, 42220, 7700, 250, 1666600000], // Harmony
    7700: [1101, 1284, 42220, 1666600000, 7777777, 534352, 8453, 59144, 7700], // Canto
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