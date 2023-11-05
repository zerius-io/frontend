"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const lodash_1 = __importDefault(require("lodash"));
const ethers_1 = require("ethers");
const starknet_1 = require("starknet");
const config_1 = require("./config");
const ABI_1 = require("./ABI");
const DB_PATH = './db/db.json';
let db = { starknet: [] };
class Collection {
    static connect(url) {
        try {
            return new ethers_1.JsonRpcProvider(url);
        }
        catch (error) {
            console.error(`Failed to connect to ${url}: ${error.message}`);
            return null;
        }
    }
    static getIpfsUri(id) {
        for (const key in config_1.ipfs) {
            const [start, end] = key.split('-').map(Number);
            if (id >= start && id <= end) {
                return `${config_1.ipfs[key].url}${id}.png`;
            }
        }
        return '';
    }
    static evm(address) {
        return __awaiter(this, void 0, void 0, function* () {
            // Array to hold all promises
            const allPromises = config_1.chains.map((CHAIN) => __awaiter(this, void 0, void 0, function* () {
                if (CHAIN.id == null || !CHAIN.rpcUrl || !CHAIN.contract)
                    return [];
                try {
                    const _provider = this.connect(CHAIN.rpcUrl);
                    // Skip the chain if the provider connection fails
                    if (!_provider)
                        return [];
                    const _contract = new ethers_1.ethers.Contract(CHAIN.contract, ABI_1.ABI, _provider);
                    const tokensCount = Number(yield _contract.balanceOf(address));
                    // Array to hold promises for this chain
                    const chainPromises = Array.from({ length: tokensCount }, (_, i) => __awaiter(this, void 0, void 0, function* () {
                        const itemId = Number(yield _contract.tokenOfOwnerByIndex(address, i));
                        const uri = this.getIpfsUri(itemId);
                        return { chainId: CHAIN.id, id: itemId, uri };
                    }));
                    // Await all promises for this chain and return the results
                    return yield Promise.all(chainPromises);
                }
                catch (error) {
                    console.error(`Error fetching collection for ${CHAIN.label}:`, error);
                    return []; // Return an empty array on error
                }
            }));
            try {
                // Await all promises for all chains
                const results = yield Promise.all(allPromises);
                // Flatten the array of arrays, sort it, and return it
                return results.flat().sort((a, b) => a.id - b.id);
            }
            catch (error) {
                console.error('Error fetching Evm collections:', error);
                return [];
            }
        });
    }
    static connectStarknet() {
        try {
            return new starknet_1.Provider({ sequencer: { baseUrl: 'https://alpha-mainnet.starknet.io' } });
        }
        catch (error) {
            console.error(`Failed to connect to Starknet}: ${error.message}`);
            return null;
        }
    }
    static convertBigIntToUint(bigInt) {
        return starknet_1.cairo.uint256(bigInt.toString());
    }
    static convertBigIntToHex(bigInt) {
        return bigInt.toString(16) || '';
    }
    static initializeDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield fs_1.promises.readFile(DB_PATH, 'utf-8');
                db = JSON.parse(data);
            }
            catch (error) {
                console.error('Error initializing database:', error);
            }
        });
    }
    static updateDatabase(mergedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                db.starknet = mergedData;
                yield fs_1.promises.writeFile(DB_PATH, JSON.stringify(db));
            }
            catch (error) {
                console.error('Error updating database:', error);
            }
        });
    }
    static fetchStarknet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = this.connectStarknet();
                if (!provider)
                    return [];
                const contract = new starknet_1.Contract(ABI_1.STARKNET_ABI, '0x043ba5e69eec55ce374e1ce446d16ee4223c1ba48c808d2dcd4e606f94ec9e15', provider);
                const lastItem = lodash_1.default.last(db.starknet);
                const lastId = lastItem ? lastItem.id : BigInt(15000000);
                const nextMintId = yield contract.getNextMintId();
                // console.log(lastItem, lastId, nextMintId)
                // console.log(BigInt(lastId) + BigInt(1) < nextMintId)
                if (BigInt(lastId) + BigInt(1) < nextMintId) {
                    const ITEMS = [];
                    for (let i = BigInt(lastId) + BigInt(1); i < nextMintId; i++) {
                        const ownerAddress = yield contract.owner_of(this.convertBigIntToUint(i));
                        const uri = this.getIpfsUri(Number(i));
                        const item = { chainId: null, id: Number(i), uri, owner: `${this.convertBigIntToHex(ownerAddress)}`.toLowerCase() };
                        ITEMS.push(item);
                    }
                    const existingData = db.starknet;
                    const mergedData = lodash_1.default.unionBy(existingData, ITEMS, 'id');
                    // console.log(mergedData)
                    db.starknet = mergedData;
                    yield this.updateDatabase(mergedData);
                    return ITEMS;
                }
                return [];
            }
            catch (error) {
                console.error('Error fetching Starknet collections:', error);
                return [];
            }
        });
    }
    static starknet(address) {
        return __awaiter(this, void 0, void 0, function* () {
            address = address.replace(/^0x0|^0x/, '').toLowerCase();
            console.log(address);
            const matchedItems = db.starknet.filter(item => item.owner.includes(address));
            console.log(matchedItems);
            const result = matchedItems.map((_b) => {
                var { owner } = _b, rest = __rest(_b, ["owner"]);
                return rest;
            });
            console.log('STARKNET', result);
            return result || [];
        });
    }
}
_a = Collection;
Collection.wait = (ms) => __awaiter(void 0, void 0, void 0, function* () { return new Promise((r) => setTimeout(r, ms)); });
exports.default = Collection;
