import { promises as fs } from 'fs'
import _, { merge } from 'lodash'

import { ethers, JsonRpcProvider } from 'ethers'
import { cairo, Provider, Contract, Uint256 } from "starknet"

import { ipfs, chains } from './config'
import { ABI, STARKNET_ABI, STARKNET_ABI_ETH } from './ABI'


const DB_PATH = './db/db.json'

let db: { starknet: DbCollectionItem[] } = { starknet: [] }

export interface CollectionItem {
    chainId: number | null
    id: number
    uri: string
}

export interface DbCollectionItem {
    chainId: number | null
    id: number
    uri: string
    owner: string
}

export default class Collection {
    static wait = async (ms: number) => new Promise((r) => setTimeout(r, ms))

    static connect(url: string): JsonRpcProvider | null {
        try {
            return new JsonRpcProvider(url)
        } catch (error: any) {
            console.error(`Failed to connect to ${url}: ${error.message}`)
            return null
        }
    }
    static getIpfsUri(id: number): string {
        for (const key in ipfs) {
            const [start, end] = key.split('-').map(Number)
            if (id >= start && id <= end) {
                return `${ipfs[key].url}${id}.png`
            }
        }

        return ''
    }

    static async evm(address: string): Promise<CollectionItem[]> {
        // Array to hold all promises
        const allPromises = chains.map(async (CHAIN) => {
            if (CHAIN.id == null || !CHAIN.rpcUrl || !CHAIN.contract) return []

            try {
                const _provider = this.connect(CHAIN.rpcUrl)
                // Skip the chain if the provider connection fails
                if (!_provider) return [];

                const _contract = new ethers.Contract(CHAIN.contract, ABI, _provider);
                const tokensCount = Number(await _contract.balanceOf(address));

                // Array to hold promises for this chain
                const chainPromises = Array.from({ length: tokensCount }, async (_, i) => {
                    const itemId = Number(await _contract.tokenOfOwnerByIndex(address, i));
                    const uri = this.getIpfsUri(itemId);
                    return { chainId: CHAIN.id, id: itemId, uri };
                });

                // Await all promises for this chain and return the results
                return await Promise.all(chainPromises);
            } catch (error) {
                console.error(`Error fetching collection for ${CHAIN.label}:`, error);
                return [];  // Return an empty array on error
            }
        })

        try {
            // Await all promises for all chains
            const results = await Promise.all(allPromises);

            // Flatten the array of arrays, sort it, and return it
            return results.flat().sort((a, b) => a.id - b.id);
        } catch (error) {
            console.error('Error fetching Evm collections:', error)
            return []
        }
    }

    static connectStarknet() {
        try {
            return new Provider({ sequencer: { baseUrl: 'https://alpha-mainnet.starknet.io' } })
        } catch (error: any) {
            console.error(`Failed to connect to Starknet}: ${error.message}`)
            return null
        }
    }

    static convertBigIntToUint(bigInt: bigint): Uint256 {
        return cairo.uint256(bigInt.toString())
    }

    static convertBigIntToHex(bigInt: bigint): string {
        return bigInt.toString(16) || ''
    }

    static async initializeDB() {
        try {
            const data = await fs.readFile(DB_PATH, 'utf-8')
            db = JSON.parse(data)
        } catch (error) {
            console.error('Error initializing database:', error)
        }
    }

    static async updateDatabase(mergedData: DbCollectionItem[]) {
        try {
            db.starknet = mergedData
            await fs.writeFile(DB_PATH, JSON.stringify(db))
        } catch (error) {
            console.error('Error updating database:', error)
        }
    }

    static async fetchStarknet() {
        try {
            const provider = this.connectStarknet()
            if (!provider) return []

            const contract = new Contract(STARKNET_ABI, '0x043ba5e69eec55ce374e1ce446d16ee4223c1ba48c808d2dcd4e606f94ec9e15', provider)

            const lastItem = _.last(db.starknet)
            const lastId = lastItem ? lastItem.id : BigInt(15000000)

            const nextMintId = await contract.getNextMintId()

            // console.log(lastItem, lastId, nextMintId)
            // console.log(BigInt(lastId) + BigInt(1) < nextMintId)

            if (BigInt(lastId) + BigInt(1) < nextMintId) {
                const ITEMS: DbCollectionItem[] = []

                for (let i = BigInt(lastId) + BigInt(1); i < nextMintId; i++) {
                    const ownerAddress = await contract.owner_of(this.convertBigIntToUint(i));
                    const uri = this.getIpfsUri(Number(i))

                    const item = { chainId: null, id: Number(i), uri, owner: `${this.convertBigIntToHex(ownerAddress)}`.toLowerCase() }
                    ITEMS.push(item)
                }

                const existingData = db.starknet
                const mergedData = _.unionBy(existingData, ITEMS, 'id')
                // console.log(mergedData)

                db.starknet = mergedData
                await this.updateDatabase(mergedData)

                return ITEMS
            }

            return []
        } catch (error) {
            console.error('Error fetching Starknet collections:', error)
            return []
        }
    }

    static async starknet(address: string): Promise<CollectionItem[]> {
        address = address.replace(/^0x0|^0x/, '').toLowerCase()
        console.log(address)

        const matchedItems = db.starknet.filter(item => item.owner.includes(address))
        console.log(matchedItems)

        const result = matchedItems.map(({ owner, ...rest }) => rest)

        console.log('STARKNET', result)
        return result || []
    }
}