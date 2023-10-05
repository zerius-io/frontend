const chains = [
    {
        id: 1,
        token: 'ETH',
        label: 'Ethereum',
        rpcUrl: 'https://ethereum.publicnode.com',
    },
    {
        id: 42161,
        token: 'ETH',
        label: 'Arbitrum',
        rpcUrl: 'https://rpc.ankr.com/arbitrum'
    },
    {
        id: 56,
        token: 'BNB',
        label: 'BNB Chain',
        rpcUrl: 'https://bsc.meowrpc.com',
        icon: 'bnb.svg'
    },
    {
        id: 43114,
        token: 'AVAX',
        label: 'Avalanche',
        rpcUrl: 'https://avax.meowrpc.com'
    },
    {
        id: 8453,
        token: 'ETH',
        label: 'Base',
        rpcUrl: 'https://base.meowrpc.com'
    },
    {
        id: 59144,
        token: 'ETH',
        label: 'Linea',
        rpcUrl: 'https://1rpc.io/linea'
    },
    {
        id: 42170,
        token: 'ETH',
        label: 'Nova',
        rpcUrl: 'https://arbitrum-nova.publicnode.com'
    },
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

const contracts = {
    // polygon mumbai
    80001: '0x75023ffe91dd4d67D0Ce5a4b0C376aa22708f1Fb',
    // base goerli
    84531: '0x23e196CC4652bc272F80c04362a30b3db87F2cB9'
}


export { chains, lzChains, contracts }