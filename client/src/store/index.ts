import { createStore } from 'vuex'

import config from './config'

import evm from './evm'
import starknet from './starknet'

export default createStore({
    modules: {
        config,
        evm,
        starknet,
    }
})