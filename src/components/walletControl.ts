import Evm from './evm.js'
import Starknet from './starknet.js'

const DEV = import.meta.env.DEV

export type walletType = 'evm' | 'starknet'

export type starknetWalletType = 'argent' | 'braavos'

export default class WalletControl {
    static async connect(type: walletType = 'evm', starknetType = 'argent') {
        if (DEV) console.log('[connect]', type)

        try {
            if (type === 'evm') {
                await Evm.toggleWallet()

                return
            }

            if (type === 'starknet') {
                await Starknet.toggleWallet(starknetType as starknetWalletType)

                return
            }
        } catch (error) {
            if (DEV) console.error(`[connect] ERROR`, error)
        } finally {

        }
    }
}