const DEV = import.meta.env.DEV

export default class Starknet {
    static async toggleWallet(walletType: 'argent' | 'braavos') {
        if (DEV) console.log('STARKNET WALLET CONNECT')

        switch (walletType) {
            case 'argent':
                await ArgentConnect.connect()
                break

            case 'braavos':
                await BraavosConnect.connect()
                break

            default:
                break
        }
    }
}

export class ArgentConnect {
    static async connect() {
    }

    static async reconnect() {
    }

    static async disconnect() {
    }
}

export class BraavosConnect {
    static async connect() {
    }

    static async reconnect() {
    }

    static async disconnect() {
    }
}
