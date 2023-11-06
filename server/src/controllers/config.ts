export interface _CHAIN {
    id: number | null
    token: string
    label: string
    rpcUrl: string
    icon?: string
    explorer: string
    lzChain: number | null
    contract: string

    testnet?: boolean
    block?: number[]
    new?: boolean
    hide?: boolean
}

export const ipfs: Record<string, { name: string, url: string }> = {
    "1-500000": {
        "name": "Ethereum",
        "url": "https://zerius.mypinata.cloud/ipfs/QmX7mjWT8wSe2kehgnGJbsyokwfeCF3oiNDp5HKhkmFdwK/"
    },
    "500001-1000000": {
        "name": "zkSync Era",
        "url": "https://zerius.mypinata.cloud/ipfs/QmXZxnwDscfX2cELzuWsbyDYujzaTv9pKWFnzGNokWoQ26/"
    },
    "1000001-1500000": {
        "name": "Arbitrum",
        "url": "https://zerius.mypinata.cloud/ipfs/QmNWKAgfo1BqMhWLK4gFMtmnhoLxQtq7rHefKkYUZRu1WR/"
    },
    "1500001-2000000": {
        "name": "Optimism",
        "url": "https://zerius.mypinata.cloud/ipfs/QmduZF1HCVTwdu4wg6gPDC9zPKTp1Uh8ueuFwg98bW2ZXL/"
    },
    "2000001-2500000": {
        "name": "Polygon",
        "url": "https://zerius.mypinata.cloud/ipfs/QmaLg3ZY5B3dkG2t2FBRHucg6jS2Puuc52eEN6UyuR4cbM/"
    },
    "2500001-3000000": {
        "name": "BSC",
        "url": "https://zerius.mypinata.cloud/ipfs/QmSugq1BqHGSQpjvepAbzVjN65MYt4dCJP1RaTpiF3jYwu/"
    },
    "3000001-3500000": {
        "name": "Avalanche",
        "url": "https://zerius.mypinata.cloud/ipfs/QmPxCcPqe8Td6ZM9qwFQoEG73XYoP4soghSCPUM7c8R5EM/"
    },
    "3500001-4000000": {
        "name": "Base",
        "url": "https://zerius.mypinata.cloud/ipfs/QmU1QQ6ZyNTXkswH3iZ71ZWyjiPtcEFiE9xqtrgpwi7ugF/"
    },
    "4000001-4500000": {
        "name": "Zora",
        "url": "https://zerius.mypinata.cloud/ipfs/QmbfPtdUTT28P5NLzcWVhQT36vtCUr6wYaZ2cqWcYGpPHu/"
    },
    "4500001-4510000": {
        "name": "Scroll",
        "url": "https://zerius.mypinata.cloud/ipfs/QmaGzVQdLxY4LuCxPsfvXm1ZKBir7VRcdrjKUcG1MG3xW5/"
    },
    "5000001-5010000": {
        "name": "Linea",
        "url": "https://zerius.mypinata.cloud/ipfs/QmctFRSdyPAe8Zc63TraPvgMYgbkNHm4UjVxnaMEmUaoiP/"
    },
    "5500001-6000000": {
        "name": "Moonbeam",
        "url": "https://zerius.mypinata.cloud/ipfs/QmctFRSdyPAe8Zc63TraPvgMYgbkNHm4UjVxnaMEmUaoiP/"
    },
    "6000001-6010001": {
        "name": "Core",
        "url": "https://zerius.mypinata.cloud/ipfs/QmVLWcGhjArxLYpzS74ebBAuEhoSDwPhac886Qp3D7CaZ9/"
    },
    "6500001-7000000": {
        "name": "Celo",
        "url": "https://zerius.mypinata.cloud/ipfs/QmXBCdqM5b5H8Ce7mhE7x7TimpxNefqWtZ3MeTEnpNvZNF/"
    },
    "7000001-7500000": {
        "name": "Harmony",
        "url": "https://zerius.mypinata.cloud/ipfs/QmabUkjcfMNTWLT4B8drCrcKq8TvMTz5puRYhsW9JDL7uc/"
    },
    "7500001-8000000": {
        "name": "Canto",
        "url": "https://zerius.mypinata.cloud/ipfs/QmX4DoshTordg7EJVsdYwqTAxyYm19vFKdKxzxWrdmDmtH/"
    },
    "8000001-8500001": {
        "name": "Polygon zkEVM",
        "url": "https://zerius.mypinata.cloud/ipfs/QmeHKzL9Uj989WPfAx5MH7PfsuzMwue1b7ZhcC517fdiLG/"
    },
    "8500001-8510000": {
        "name": "Fantom",
        "url": "https://zerius.mypinata.cloud/ipfs/QmQKgMFFykh9dchK419gxz337PwjhUKHN5MH6kRFW6e6dn/"
    },
    "9000001-9500000": {
        "name": "Canto",
        "url": "https://zerius.mypinata.cloud/ipfs/QmX7mjWT8wSe2kehgnGJbsyokwfeCF3oiNDp5HKhkmFdwK/"
    },
    "9500001-9530000": {
        "name": "Arbitrum Nova 1pt",
        "url": "https://zerius.mypinata.cloud/ipfs/QmUMCWhMmTjsKPRP8JpcPsstrTw3ujPDfbsw7m64C4ewQM/"
    },
    "9530001-9550000": {
        "name": "Arbitrum Nova 2pt",
        "url": "https://zerius.mypinata.cloud/ipfs/Qmb9dEBxYHstLzZMd7ExLGAgXug1yHqvriNMGsUon3RMYP/"
    },
    "9550001-9580000": {
        "name": "Arbitrum Nova 3pt",
        "url": "https://zerius.mypinata.cloud/ipfs/QmNTcWiLpoDhU4gp1GmrzrcBxqrqrWkqWe8osYdpAyshxA/"
    },
    "9580001-9600000": {
        "name": "Arbitrum Nova 4pt",
        "url": "https://zerius.mypinata.cloud/ipfs/QmRv7at5iXTfWV514ozRhVa3ReLKD4st3FCGiEopfuNvyu/"
    },
    "10000001-10010001": {
        "name": "Metis",
        "url": "https://zerius.mypinata.cloud/ipfs/QmaGzVQdLxY4LuCxPsfvXm1ZKBir7VRcdrjKUcG1MG3xW5/"
    },
    "15000001-20000000": {
        "name": "Starknet",
        "url": "https://zerius.mypinata.cloud/ipfs/QmUeFoCrFwJzpf2cXv2ocz2EFYZXGSKDG79BbxmLLrNuYg/"
    }
}

export const chains: _CHAIN[] = [
    {
        "id": 1,
        "token": "ETH",
        "label": "Ethereum",
        "rpcUrl": "https://rpc.ankr.com/eth",
        "lzChain": 101,
        "contract": "0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41",
        "explorer": "https://etherscan.io"
    },
    {
        "id": null,
        "token": "ETH",
        "label": "Starknet",
        "rpcUrl": "https://starknet-mainnet.public.blastapi.io",
        "icon": "starknet.png",
        "lzChain": null,
        "contract": "0x043ba5e69eec55ce374e1ce446d16ee4223c1ba48c808d2dcd4e606f94ec9e15",
        "explorer": "https://starkscan.co/",
        "block": [
            0
        ]
    },
    {
        "id": 42161,
        "token": "ETH",
        "label": "Arbitrum One",
        "rpcUrl": "https://arb1.arbitrum.io/rpc",
        "icon": "arbitrum.svg",
        "lzChain": 110,
        "contract": "0x250c34D06857b9C0A036d44F86d2c1Abe514B3Da",
        "explorer": "https://arbiscan.io"
    },
    {
        "id": 324,
        "token": "ETH",
        "label": "zkSync",
        "rpcUrl": "https://mainnet.era.zksync.io",
        "lzChain": 165,
        "contract": "0x7da50bd0fb3c2e868069d9271a2aeb7ed943c2d6",
        "explorer": "https://explorer.zksync.io",
        "block": [
            7777777,
            534352,
            1088,
            1284,
            1116,
            42220,
            324
        ]
    },
    {
        "id": 8453,
        "token": "ETH",
        "label": "Base",
        "rpcUrl": "https://mainnet.base.org",
        "lzChain": 184,
        "contract": "0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41",
        "explorer": "https://basescan.org",
        "block": [
            534352,
            1116,
            42220,
            7700,
            8453
        ]
    },
    {
        "id": 250,
        "token": "FTM",
        "label": "Fantom",
        "rpcUrl": "https://rpc.ankr.com/fantom",
        "lzChain": 112,
        "contract": "0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7",
        "explorer": "https://ftmscan.com/",
        "block": [
            7777777,
            534352,
            1116,
            1666600000,
            250
        ],
        "new": true
    },
    {
        "id": 1101,
        "token": "ETH",
        "label": "Poly zkEVM",
        "rpcUrl": "https://zkevm-rpc.com",
        "icon": "zkevm.svg",
        "lzChain": 158,
        "contract": "0x4c5AeDA35d8F0F7b67d6EB547eAB1df75aA23Eaf",
        "explorer": "https://zkevm.polygonscan.com/",
        "block": [
            7777777,
            534352,
            42170,
            1284,
            1116,
            1666600000,
            7700,
            1101
        ],
        "new": true
    },
    {
        "id": 1088,
        "token": "METIS",
        "label": "Metis",
        "rpcUrl": "https://metis-mainnet.public.blastapi.io",
        "lzChain": 151,
        "contract": "0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7",
        "explorer": "https://andromeda-explorer.metis.io/",
        "block": [
            7777777,
            534352,
            324,
            1284,
            1116,
            42220,
            1666600000
        ],
        "new": true,
        "hide": true
    },
    {
        "id": 1284,
        "token": "GLMR",
        "label": "Moonbeam",
        "rpcUrl": "https://moonbeam.publicnode.com",
        "lzChain": 126,
        "contract": "0x4c5aeda35d8f0f7b67d6eb547eab1df75aa23eaf",
        "explorer": "https://moonscan.io/",
        "block": [
            1101,
            1088,
            7777777,
            534352,
            324,
            59144,
            1116,
            42220,
            7700
        ],
        "new": true,
        "hide": true
    },
    {
        "id": 1116,
        "token": "CORE",
        "label": "Core",
        "rpcUrl": "https://rpc.coredao.org",
        "lzChain": 153,
        "contract": "0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7",
        "explorer": "https://scan.coredao.org/",
        "block": [
            1101,
            1088,
            1284,
            7777777,
            534352,
            8453,
            324,
            59144,
            42170,
            250,
            42220,
            1666600000,
            7700,
            1116,
            42220
        ],
        "new": true
    },
    {
        "id": 42220,
        "token": "CELO",
        "label": "Celo",
        "rpcUrl": "https://forno.celo.org",
        "lzChain": 125,
        "contract": "0x4c5aeda35d8f0f7b67d6eb547eab1df75aa23eaf",
        "explorer": "https://celoscan.io/",
        "block": [
            1088,
            1284,
            1284,
            7777777,
            534352,
            8453,
            324,
            59144,
            42170,
            1666600000,
            7700,
            42220,
            1116
        ],
        "new": true
    },
    {
        "id": 1666600000,
        "token": "ONE",
        "label": "Harmony",
        "rpcUrl": "https://api.harmony.one",
        "lzChain": 116,
        "contract": "0x5188368a92b49f30f4cf9bef64635bcf8459c7a7",
        "explorer": "https://explorer.harmony.one/",
        "block": [
            1101,
            1088,
            7777777,
            8453,
            324,
            59144,
            42170,
            42220,
            7700,
            250,
            1666600000
        ],
        "new": true
    },
    {
        "id": 7700,
        "token": "CANTO",
        "label": "Canto",
        "rpcUrl": "https://canto.gravitychain.io",
        "lzChain": 159,
        "contract": "0x5188368a92b49f30f4cf9bef64635bcf8459c7a7",
        "explorer": "https://cantoscan.com/",
        "block": [
            1101,
            1284,
            42220,
            1666600000,
            7777777,
            534352,
            8453,
            59144,
            7700
        ],
        "new": true
    },
    {
        "id": 59144,
        "token": "ETH",
        "label": "Linea",
        "rpcUrl": "https://linea.drpc.org",
        "lzChain": 183,
        "contract": "0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7",
        "explorer": "https://lineascan.build/",
        "block": [
            534352,
            7777777,
            42170,
            1284,
            1116,
            42220,
            7700,
            59144
        ]
    },
    {
        "id": 42170,
        "token": "ETH",
        "label": "Nova",
        "rpcUrl": "https://arbitrum-nova.drpc.org",
        "icon": "nova.svg",
        "lzChain": 175,
        "contract": "0x5188368a92B49F30f4Cf9bEF64635bCf8459c7A7",
        "explorer": "https://nova.arbiscan.io/",
        "block": [
            7777777,
            534352,
            59144,
            1101,
            1116,
            42220,
            42170
        ]
    },
    {
        "id": 10,
        "token": "ETH",
        "label": "Optimism",
        "rpcUrl": "https://rpc.ankr.com/optimism",
        "lzChain": 111,
        "contract": "0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41",
        "explorer": "https://optimistic.etherscan.io"
    },
    {
        "id": 137,
        "token": "MATIC",
        "label": "Polygon",
        "rpcUrl": "https://rpc.ankr.com/polygon",
        "lzChain": 109,
        "contract": "0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41",
        "explorer": "https://polygonscan.com"
    },
    {
        "id": 56,
        "token": "BNB",
        "label": "BNB Chain",
        "rpcUrl": "https://rpc.ankr.com/bsc",
        "icon": "bnb.svg",
        "lzChain": 102,
        "contract": "0x250c34D06857b9C0A036d44F86d2c1Abe514B3Da",
        "explorer": "https://bscscan.com",
        "block": [
            7777777,
            56
        ]
    },
    {
        "id": 43114,
        "token": "AVAX",
        "label": "Avalanche",
        "rpcUrl": "https://rpc.ankr.com/avalanche",
        "lzChain": 106,
        "contract": "0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41",
        "explorer": "https://snowtrace.io",
        "block": [
            7777777,
            43114
        ]
    },
    {
        "id": 7777777,
        "token": "ETH",
        "label": "Zora",
        "rpcUrl": "https://rpc.zora.energy",
        "lzChain": 195,
        "contract": "0x178608fFe2Cca5d36f3Fc6e69426c4D3A5A74A41",
        "explorer": "https://explorer.zora.energy/",
        "block": [
            56,
            43114,
            534352,
            250,
            42170,
            59144,
            324,
            1101,
            1088,
            1284,
            1116,
            42220,
            7700,
            7777777
        ]
    },
    {
        "id": 534352,
        "token": "ETH",
        "label": "Scroll",
        "rpcUrl": "https://scroll.blockpi.network/v1/rpc/public",
        "icon": "scroll.png",
        "lzChain": 214,
        "contract": "0xEB22C3e221080eAD305CAE5f37F0753970d973Cd",
        "explorer": "https://scrollscan.com",
        "block": [
            7777777,
            8453,
            250,
            42170,
            59144,
            1101,
            1088,
            1284,
            1116,
            42220,
            7700,
            534352
        ]
    },
    {
        "id": 80001,
        "token": "MATIC",
        "label": "Mumbai",
        "rpcUrl": "https://polygon-mumbai-bor.publicnode.com",
        "icon": "polygon.svg",
        "lzChain": 10109,
        "contract": "0x75023ffe91dd4d67D0Ce5a4b0C376aa22708f1Fb",
        "explorer": "https://mumbai.polygonscan.com/",
        "testnet": true,
        "block": [
            1,
            42161,
            137,
            56,
            43114,
            10,
            1101,
            1088,
            1284,
            7777777,
            534352,
            8453,
            324,
            59144,
            42170,
            250,
            42220,
            1666600000,
            7700,
            1116,
            42220
        ]
    },
    {
        "id": 84531,
        "token": "ETH",
        "label": "Base Goreli",
        "rpcUrl": "https://base-goerli.publicnode.com",
        "icon": "base.svg",
        "lzChain": 10160,
        "contract": "0x23e196CC4652bc272F80c04362a30b3db87F2cB9",
        "explorer": "https://goerli.basescan.org/",
        "testnet": true,
        "block": [
            1,
            42161,
            137,
            56,
            43114,
            10,
            1101,
            1088,
            1284,
            7777777,
            534352,
            8453,
            324,
            59144,
            42170,
            250,
            42220,
            1666600000,
            7700,
            1116,
            42220
        ]
    }
]