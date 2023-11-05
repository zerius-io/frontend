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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const collection_1 = __importDefault(require("./controllers/collection"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)()); // Enable All CORS Requests
app.use((0, helmet_1.default)()); // Set security headers
app.use(body_parser_1.default.json()); // Parse JSON bodies
// In-memory store to hold rate limit data
let rateLimits = {};
// Function to clear rate limits
const clearRateLimits = () => {
    rateLimits = {};
};
// Schedule the clearRateLimits function to run every 5 mins
setInterval(clearRateLimits, 60 * 5 * 1000);
app.post('/api/collection', (req, res, next) => {
    const { evmAddress, starknetAddress } = req.body;
    if ((!evmAddress && !starknetAddress) ||
        (evmAddress && (typeof evmAddress !== 'string' || evmAddress.length !== 42)) ||
        (starknetAddress && (typeof starknetAddress !== 'string' || (starknetAddress.length < 65 && starknetAddress.length < 66)))) {
        return res.status(400).send('Invalid address');
    }
    next();
}, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { evmAddress, starknetAddress } = req.body;
    let result = [];
    const now = Date.now();
    if (evmAddress) {
        rateLimits[evmAddress] = rateLimits[evmAddress] || { lastRequest: 0, requests: 0 };
        if (now - rateLimits[evmAddress].lastRequest < 1000) {
            return res.status(429).send('Too Many Requests');
        }
        rateLimits[evmAddress].lastRequest = now;
        rateLimits[evmAddress].requests += 1;
        result.push(yield collection_1.default.evm(evmAddress));
    }
    if (starknetAddress) {
        rateLimits[starknetAddress] = rateLimits[starknetAddress] || { lastRequest: 0, requests: 0 };
        if (now - rateLimits[starknetAddress].lastRequest < 1000) {
            return res.status(429).send('Too Many Requests');
        }
        rateLimits[starknetAddress].lastRequest = now;
        rateLimits[starknetAddress].requests += 1;
        result.push(yield collection_1.default.starknet(starknetAddress));
    }
    // console.log('RES')
    res.send(JSON.stringify(result.flat()));
}));
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running on http://localhost:${PORT}`);
    yield collection_1.default.initializeDB();
    yield collection_1.default.fetchStarknet();
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        yield collection_1.default.fetchStarknet();
    }), 5 * 60 * 1000);
}));
