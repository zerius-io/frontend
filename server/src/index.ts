import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import Collection, { CollectionItem } from './controllers/collection'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())  // Enable All CORS Requests
app.use(helmet())  // Set security headers
app.use(bodyParser.json())  // Parse JSON bodies


interface RateLimitData {
    lastRequest: number
    requests: number
}

type RateLimits = { [address: string]: RateLimitData }

// In-memory store to hold rate limit data
let rateLimits: RateLimits = {}

// Function to clear rate limits
const clearRateLimits = () => {
    rateLimits = {}
}

// Schedule the clearRateLimits function to run every 5 mins
setInterval(clearRateLimits, 60 * 5 * 1000)


app.post('/api/collection', (req, res, next) => {
    const { evmAddress, starknetAddress } = req.body

    if ((!evmAddress && !starknetAddress) ||
        (evmAddress && (typeof evmAddress !== 'string' || evmAddress.length !== 42)) ||
        (starknetAddress && (typeof starknetAddress !== 'string' || (starknetAddress.length < 65 && starknetAddress.length < 66)))) {
        return res.status(400).send('Invalid address')
    }

    next()
}, async (req, res) => {
    const { evmAddress, starknetAddress } = req.body

    let result: CollectionItem[][] = []

    const now = Date.now()

    if (evmAddress) {
        rateLimits[evmAddress] = rateLimits[evmAddress] || { lastRequest: 0, requests: 0 }
        if (now - rateLimits[evmAddress].lastRequest < 1000) {
            return res.status(429).send('Too Many Requests')
        }
        rateLimits[evmAddress].lastRequest = now
        rateLimits[evmAddress].requests += 1

        result.push(await Collection.evm(evmAddress))
    }

    if (starknetAddress) {
        rateLimits[starknetAddress] = rateLimits[starknetAddress] || { lastRequest: 0, requests: 0 }
        if (now - rateLimits[starknetAddress].lastRequest < 1000) {
            return res.status(429).send('Too Many Requests')
        }
        rateLimits[starknetAddress].lastRequest = now
        rateLimits[starknetAddress].requests += 1

        result.push(await Collection.starknet(starknetAddress))
    }

    // console.log('RES')
    res.send(JSON.stringify(result.flat()))
})

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`)

    await Collection.initializeDB()
    await Collection.fetchStarknet()

    setInterval(async () => {
        await Collection.fetchStarknet()
    }, 5 * 60 * 1000)
})
