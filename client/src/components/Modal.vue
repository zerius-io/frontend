<script setup lang="ts">
import { ref, computed } from 'vue'

import { VueFinalModal } from 'vue-final-modal'
import { useToast } from 'vue-toastification'

import store from '@/store'

import WalletControl, { walletType } from '@/controllers/walletControl'
import Config from '@/controllers/config'
import Evm from '@/controllers/evm'
import Starknet, { _starknetWalletType } from '@/controllers/starknet'

import CustomSelect from "./Select.vue"
import Collectable from './Collectable.vue'

import Spinner from '../components/Spinner.vue'
import Toast from '../components/Toast.vue'

// IMG
import ok_img from '/img/ok.svg'
import error_img from '/img/error.svg'

import icon_metamask from '/img/wallets/metamask.png'
import icon_argent from '/img/wallets/argent.png'
import icon_braavos from '/img/wallets/braavos.png'


const { title, collectable } = defineProps<{
    walletConnect?: boolean,
    title?: string,
    collectable?: any,
    close: any
}>()

const emit = defineEmits<{
    (e: 'confirm'): void
}>()

const STARKNET_CHAIN_ID = 2344859429196833

const selectedChain = ref(null)
const selectedChainRef = ref(null)

const bridging = ref(false)
const res = ref(null)

const toast = useToast()
const showToast = (info, explorer = null) => toast({
    component: Toast,
    props: {
        info,
        explorer,
        close
    }
})

async function bridge() {
    const chainId = selectedChainRef.value?.selected?.id

    bridging.value = true

    const { result, msg, receipt } = await Evm.bridge(
        collectable.id,
        collectable.chainId,
        chainId,
        showToast
    )
    res.value = { result, msg, receipt }

    bridging.value = false

    showToast(msg, { id: chainId, hash: receipt?.hash })

    if (result) {
        store.commit('evm/setCollection', { ...collectable, chainId })
    }
}

const mintCase = computed(() => title === 'Yay, congratulations!')

const bridgeCase = computed(() => title === 'Send')
const afterBridge = computed(() => res.value !== null)
const bridgeOk = computed(() => res.value?.result)


// Wallet Connect
// EVM
const isEvmWalletConnected = computed(() => Evm.isWalletConnected)
const evmConnectedWallet = computed(() => Evm.connectedWallet)
// Starknet
const isStarknetWalletConnected = computed(() => Starknet.isWalletConnected)
const starknetConnectedWallet = computed(() => Starknet.connectedWallet)
const starknetProvider = computed(() => Starknet.provider)
const starknetWalletProviderName = computed(() => starknetProvider?.value?.name || '')

const formatAddress = (address) => Evm.formatAddress(address)

async function connect(type: walletType, starknetWalletType?: _starknetWalletType) {
    if (type === 'evm') emit('confirm')

    await WalletControl.connect(type, starknetWalletType)
}

const isDisabled = computed(() => collectable.chainId === STARKNET_CHAIN_ID)
</script>

<template>
    <VueFinalModal class="modal flex" content-class="modal-content" overlay-transition="vfm-fade"
        content-transition="vfm-fade">
        <div v-if="!walletConnect" class="">
            <h1>{{ !res ? title : bridgeOk ? 'Success!' : 'Something went wrong :(' }}</h1>

            <custom-select v-if="bridgeCase" ref="selectedChainRef" class="select-modal" :options="Config.chains"
                v-model="selectedChain" :isolate="true" :initialChainId="collectable.chainId" />

            <div v-if="!afterBridge">
                <Collectable :item="collectable" :clickable="false" />

                <button v-if="bridgeCase" @click="bridge" :disabled="isDisabled || bridging" class="button__full">
                    {{ bridging ? 'Sending' : 'Send' }}
                    <Spinner v-if="bridging" />
                </button>
            </div>
            <div v-else>
                <img class="status" alt="status" :src="bridgeOk ? ok_img : error_img" />

                <div v-if="bridgeCase" class="flex" style="flex-direction: column;">
                    <button @click="close" :disabled="isDisabled || bridging" class="button__full">
                        {{ bridging ? 'Sending' : 'Send again' }}
                        <Spinner v-if="bridging" />
                    </button>
                </div>
            </div>

            <div v-if="mintCase">
                <button class="button__full" @click="close">Mint again</button>
            </div>

            <slot />
        </div>

        <div v-else>
            <h1 style="margin-bottom: 2rem">Connect Wallet</h1>

            <h1>EVM</h1>
            <div style="display: flex; flex-direction: column;">
                <button class="button button__shadow flex" @click="connect('evm')">
                    <img class="wallet-icon" alt="wallet" :src="icon_metamask" />
                    {{ isEvmWalletConnected ? formatAddress(evmConnectedWallet?.accounts[0]?.address) : 'Connect MetaMask'
                    }}
                </button>
            </div>

            <h1>Starknet</h1>
            <div style="display: flex; flex-direction: column;">
                <button class="button button__shadow flex" @click="connect('starknet', 'argent')">
                    <img class="wallet-icon" alt="wallet" :src="icon_argent" />
                    {{
                        isStarknetWalletConnected && starknetWalletProviderName === 'Argent X' ?
                        formatAddress(starknetConnectedWallet) :
                        'Connect Argent X'
                    }}
                </button>

                <button class="button button__shadow flex" @click="connect('starknet', 'braavos')">
                    <img class="wallet-icon" alt="wallet" :src="icon_braavos" />
                    {{
                        isStarknetWalletConnected && starknetWalletProviderName === 'Braavos' ?
                        formatAddress(starknetConnectedWallet) :
                        'Connect Braavos'
                    }}
                </button>
            </div>
        </div>

    </VueFinalModal>
</template>

<style lang="scss">
.modal {
    display: flex;
    justify-content: center;
    align-items: center;

    .collectable-item {
        margin: 1rem auto;
    }

    &-content {
        display: flex;
        flex-direction: column;

        padding: 1.5rem 1.5rem;

        background: #fff;
        border-radius: 1.5rem;

        &->*+* {
            margin: 0.5rem 0;
        }

        h1 {
            margin: 1rem auto;

            font-size: 1.125rem;
            font-style: normal;
            font-weight: 600;

            line-height: 80%;

            color: var(--dark, #18181B);
        }

        .status {
            margin: .8rem;

            width: 12.6875rem;
            height: 12.6875rem;
        }

        button {
            margin: .5rem auto;
            padding: 0.5rem 1.5rem;

            width: 12.5rem;
            height: 3rem;
        }

        .wallet-icon {
            width: 2rem;
            height: 2rem;

            margin-right: 1rem;
        }
    }
}
</style>