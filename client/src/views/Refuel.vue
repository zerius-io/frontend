<script setup lang="ts">
import { ref, computed, watch, onMounted, watchEffect, reactive } from 'vue'
import * as _ from 'lodash'

import { useToast } from 'vue-toastification'

import Config from '@/controllers/config'
import Evm from '@/controllers/evm'

import CustomSelect from '@/components/Select.vue'

import Spinner from '../components/Spinner.vue'
import Toast from '../components/Toast.vue'

import switch_img from '/img/switch.svg'


const toast = useToast()
const showToast = (info, explorer = null) => toast({
    component: Toast,
    props: {
        info,
        explorer,
        close
    }
})

const _CHAINS = Config.chains
const _SETTINGS = Config.bridge

const selectedChainFrom = ref(null)
const selectedChainTo = ref(null)

// FUNCTIONS
const filteredOptions = computed(() => {
    let SELECT_CHAINS = []

    const block = Config.getChainById(state.refuel.chain.from)?.block || []
    if (block.includes(0)) {
        SELECT_CHAINS = []
    } else {
        SELECT_CHAINS = _CHAINS.filter((option) =>
            !_SETTINGS.disabled.includes(option.id) && !block.includes(option.id)
        )
    }

    return SELECT_CHAINS.filter((chain) => state.refuel.chain.from !== chain.id)
})

const updateBalance = async () => {
    if (state.user.connected) state.user.balance.raw = normalizeValue(Number(await Evm.getBalance(true)))
}

const fetchTokenPrice = async (symbol: string) => {
    return (symbol) ? await Evm.fetchPrice(symbol) : null
}

const updatePrices = async () => {
    if (state.refuel.chain.isSameToken) {
        state.refuel.chain.from.price = await Evm.fetchPrice(state.refuel.chain.from.token)
        state.refuel.chain.to.price = state.refuel.chain.to.price
        return
    }

    state.refuel.chain.from.price = await Evm.fetchPrice(state.refuel.chain.from.token)
    state.refuel.chain.to.price = await Evm.fetchPrice(state.refuel.chain.to.token)
}

const updateMaxAmount = async () => {
    state.refuel.amount.max.raw = Number(await Evm.getMaxTokenValueInDst(
        state.refuel.chain.from.id,
        state.refuel.chain.to.id,
        true
    ))
}

const updateFeeAmount = async () => {
    const amount = normalizeValue(
        state.refuel.chain.isSameToken ?
            state.refuel.amount.user.raw :
            (state.refuel.amount.user.raw * state.refuel.chain.from.price) / state.refuel.chain.to.price,
        5
    )

    const fee = await Evm.estimateRefuelFee(state.refuel.chain.from.id, state.refuel.chain.to.id, amount.toString())

    state.refuel.fee.native.raw = fee.nativeFee
    state.refuel.fee.lz.raw = Math.abs(state.refuel.amount.user.raw - fee.nativeFee)
}

const updateInfo = _.debounce(async () => {
    state.loading = true

    const amount = state.refuel.amount.user.raw

    if (amount > 0) {
        if (amount <= state.user.balance.raw &&
            amount <= state.refuel.amount.max.raw) {
            await updateFeeAmount()
        }
    } else {
        state.refuel.fee.lz.raw = null
        state.refuel.output.raw = null
    }

    state.loading = false
}, 500)

const setMax = () => {
    if (state.user.balance.raw > state.refuel.amount.max.output) {
        state.refuel.amount.user.raw = state.refuel.amount.max.output
    } else {
        state.refuel.amount.user.raw = state.user.balance.raw
    }
}

const normalizeValue = (value: number, unit = 5) => {
    return value !== null ? parseFloat(value.toFixed(unit)) : 0
}

const switchChains = async () => {
    if (selectedChainFrom.value && selectedChainTo.value) {
        const temp = selectedChainFrom.value.selected

        selectedChainFrom.value.selected = selectedChainTo.value.selected
        selectedChainTo.value.selected = temp

        updateData()
    }
}

const updateData = async () => {
    if (!state.user.connected) {
        if (state.user.chain && state.refuel.chain.from) selectedChainFrom.value.selected = state.user.chain

        await updateMaxAmount()
        await updateInfo()
    }
}

const refuel = async () => {
    if (state.user.chain.id !== selectedChainFrom?.value.selected.id) {
        await Evm.setChainById(selectedChainFrom.selected.id)
        return
    }

    state.refueling = true

    const fromChainId = selectedChainFrom.value?.selected.id
    const toChainId = selectedChainTo.value?.selected.id

    const amount = normalizeValue(
        state.refuel.chain.isSameToken ?
            state.refuel.amount.user.raw :
            (state.refuel.amount.user.raw * state.refuel.chain.from.price) / state.refuel.chain.to.price,
        5
    ).toString()

    console.log(fromChainId, toChainId, amount)

    const { result, msg, receipt } = await Evm.refuel(
        fromChainId,
        toChainId,
        amount,
        showToast
    )

    console.log('REFUEL', result, msg, receipt)

    state.refueling = false

    showToast(msg, { id: fromChainId, hash: receipt?.hash })

    await updateBalance()
}

const state = reactive({
    loading: false,
    refueling: false,
    button: {
        label: computed(() => {
            if (!state.user.connected) return 'Connect wallet'
            if (state.user.chain.id !== selectedChainFrom.value?.selected.id) return `Switch network to ${selectedChainFrom.value?.selected.label}`

            if (!state.loading.value && state.refuel.amount.max.raw <= 0) return `Can't bridge to ${selectedChainTo.value?.selected.label}`

            if (state.refuel.amount.user.raw <= 0) return 'Enter amount'
            if (state.refuel.amount.user.raw > state.user.balance.raw) return 'Insufficient Balance'
            if (state.refuel.amount.user.raw > state.refuel.amount.max.raw) return 'Amount too large'
            if (!state.loading.value && state.refuel.fee.native.raw === null) return `Incorrect amount`

            if (state.refuel.amount.user.raw <= state.user.balance.raw) return 'Send'
            if (state.refueling) return 'Sending...'
        }),
        disabled: computed(() =>
            !state.user.connected ||
            state.user.chain.id !== state.refuel.chain.from.id ||
            state.loading ||
            state.refuel.amount.user.raw <= 0 ||
            state.refuel.amount.max.raw <= 0 ||
            state.refuel.fee.native.raw === null ||
            state.refuel.amount.user.raw > state.user.balance.raw ||
            state.refuel.amount.user.raw > state.refuel.amount.max.raw ||
            state.refueling
        ),
    },
    input: {
        placeholder: computed(() => `0 ${state.chain?.from?.label || 'ETH'}`),
        disabled: computed(() =>
            !state.user.connected ||
            state.refueling
        )
    },
    user: {
        connected: computed(() => Evm.isWalletConnected),
        wallet: computed(() => Evm.connectedWallet),
        chain: computed(() => Evm.selectedChain),
        balance: {
            raw: null,
            USD: computed(() => {
                const USD = normalizeValue(state.user.balance.raw * state.refuel.chain.from.price)
                return USD !== 0 ? `$(${USD})` : null
            }),
            output: computed(() => normalizeValue(state.user.balance.raw))
        }
    },
    refuel: {
        chain: {
            isSameToken: computed(() => {
                return state.refuel.chain.from.token === state.refuel.chain.to.token
            }),
            from: computed(() => {
                const chain = selectedChainFrom.value?.selected || { id: null, token: null, label: '-', price: null }
                if (chain.token) fetchTokenPrice(chain.token).then(price => chain.price = price)
                return chain
            }),
            to: computed(() => {
                const chain = selectedChainTo.value?.selected || { id: null, token: null, label: '-', price: null }
                if (chain.token) fetchTokenPrice(chain.token).then(price => chain.price = price)
                return chain
            })
        },
        amount: {
            max: {
                raw: null,
                USD: computed(() => {
                    const USD = normalizeValue(state.refuel.amount.max.raw * state.refuel.chain.to.price)
                    return USD !== 0 ? `$(${USD})` : null
                }),
                output: computed(() => {
                    let output = 0

                    if (state.refuel.amount.max.raw && state.user.connected) {
                        output = normalizeValue(
                            state.refuel.chain.isSameToken ?
                                state.refuel.amount.max.raw :
                                (state.refuel.amount.max.raw * state.refuel.chain.to.price) / state.refuel.chain.from.price,
                            5
                        )
                    }

                    return output
                })
            },
            user: {
                raw: null,
                USD: computed(() => {
                    const USD = normalizeValue(state.refuel.user.raw * state.refuel.chain.from.price, 2)
                    return USD !== 0 ? `$(${USD})` : null
                }),
                output: computed(() => normalizeValue(state.refuel.user.raw))
            }
        },
        fee: {
            native: {
                raw: null,
                USD: computed(() => {
                    const USD = normalizeValue(state.refuel.fee.native.raw * state.refuel.chain.from.price, 2)
                    return USD !== 0 ? `$(${USD})` : null
                }),
                output: computed(() => `${state.refuel.fee.lz.raw ? '0' : '--'} ${state.refuel.chain.from.token}`)
            },
            lz: {
                raw: null,
                USD: computed(() => {
                    const USD = normalizeValue(state.refuel.fee.lz.raw * state.refuel.chain.from.price, 2)
                    return USD !== 0 ? `$(${USD})` : null
                }),
                output: computed(() => {
                    let output = 0

                    if (state.refuel.fee.lz.raw) output = normalizeValue(state.refuel.fee.lz.raw, output > 1 ? 4 : 5)

                    return `${output !== 0 ? output : '--'} ${state.refuel.chain.from.token}`
                })
            },
        },
        output: {
            raw: null,
            USD: computed(() => {
                const USD = normalizeValue(state.refuel.output.raw *
                    (state.refuel.chain.isSameToken ? state.refuel.chain.from.price : state.refuel.chain.to.price),
                    2)

                return USD !== 0 ? `$(${USD})` : null
            }),
            output: computed(() => {
                let output = 0

                if (state.refuel.amount.user.raw && state.user.connected) {
                    output = state.refuel.chain.isSameToken ?
                        state.refuel.amount.user.raw :
                        (state.refuel.amount.user.raw * state.refuel.chain.from.price) / state.refuel.chain.to.price

                    output = normalizeValue(output, output > 1 ? 4 : 5)

                    state.refuel.output.raw = output
                }

                return `${output ? output : '--'} ${state.refuel.chain.to.token}`
            })
        },
        time: computed(() => {
            if (!state.refuel.amount.max.raw) return '--'

            const transferTimeMap = {
                137: '~5min',
                1101: '~3min'
            }

            if (transferTimeMap[state.refuel.chain.from.id]) return transferTimeMap[state.refuel.chain.from.id]
            if (transferTimeMap[state.refuel.chain.to.id]) return transferTimeMap[state.refuel.chain.to.id]
            return '~1min'
        })
    }
})


onMounted(() => {
    if (state.user.chain) selectedChainFrom.value.selected = state.user.chain
})

watchEffect(() => {
    if (state.user.chain && selectedChainFrom.value?.selected) {
        selectedChainFrom.value.selected = state.user.chain
    }

    if (state.refuel.chain.from && state.refuel.chain.to) {
        console.log('SELECTED', state.refuel.chain.to.label, state.refuel.chain.from.label)

        updateBalance()
        updateMaxAmount()
        updateInfo()
    }
})

watch(() => Evm.walletAddress, (newValue, oldValue) => {
    if (newValue !== oldValue) updateData()
}, { immediate: true })

watch(state.user.chain, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        if (selectedChainFrom.value?.selected) selectedChainFrom.value.selected = newValue
        updateInfo()
    }
})

watch(() => [state.refuel.chain.from.id, state.refuel.chain.to.id],
    ([newFromId, newToId]) => {
        if (newFromId) {
            updateBalance()
        }
        if (newFromId && newToId) {
            updateData()
        }
    },
    { immediate: true }
)

watch(() => state.refuel.amount.user.raw, (newVal, oldVal) => {
    if (state.user.connected) updateInfo()
})
</script>

<template>
    <h1 style="max-width: 60%;">Refuel via LayerZero</h1>

    <div class="refuel-container">
        <div class="refuel-header">
            <div class="flex column" style="justify-content: flex-start; align-items: flex-start;">
                <div>From</div>
                <custom-select ref="selectedChainFrom" class="select-modal" :options="Config.chains" :isolate="true" />
            </div>

            <!-- <img @click="switchChains" :src="switch_img" alt="switch" class="refuel-header-switch"> -->

            <div class="flex column" style="justify-content: flex-start; align-items: flex-start;">
                <div>To</div>
                <custom-select ref="selectedChainTo" class="select-modal" :options="filteredOptions" :isolate="true"
                    :initialChainId="state.user.chain.id" />
            </div>
        </div>

        <div class="refuel-center">
            <div class="flex">
                <div>Refuel amount</div>
                <div class=flex>
                    <div v-if="state.user.balance.output">Balance: {{ state.user.balance.output }}</div>
                </div>
            </div>

            <div class="input-container">
                <input :disabled="state.input.disabled" v-model="state.refuel.amount.user.raw"
                    :placeholder="state.input.placeholder" type="number">

                <button :disabled="state.user.balance.raw <= 0" @click="setMax"
                    :class="{ 'max-button': true, 'loading': state.loading }">MAX</button>
            </div>
            <span v-if="state.refuel.amount.max.output" class="info-value-max">
                Max refuel: {{ state.refuel.amount.max.output }}
            </span>
        </div>

        <div class="refuel-info">
            <div class="info-item">
                <span class="info-label">Estimated Transfer Time:</span>
                <span :class="{ 'info-value': true, 'loading': state.loading }">{{ state.refuel.time }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Refuel Fee:</span>
                <span :class="{ 'info-value': true, 'loading': state.loading }">
                    {{ state.refuel.fee.native.output }}
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">LayerZero Fee:</span>
                <span :class="{ 'info-value': true, 'loading': state.loading }">
                    {{ state.refuel.fee.lz.output }}
                    <span class="info-value-usd">{{ state.refuel.fee.lz.USD }}</span>
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">Expected Output:</span>
                <span :class="{ 'info-value': true, 'loading': state.loading }">
                    {{ state.refuel.output.output }}
                    <span class="info-value-usd">{{ state.refuel.output.USD }}</span>
                </span>
            </div>
        </div>

        <button @click="refuel" :disabled="state.button.disabled" class="button__full">
            {{ state.button.label }}
            <Spinner v-if="state.refueling" />
        </button>
    </div>
</template>
  
<style lang="scss">
.refuel {
    position: relative;

    &-container {
        position: relative;

        display: flex;
        flex-direction: column;

        max-width: 27rem;

        margin: 0 auto;
        padding: 3rem;

        border-radius: 1.5rem;
        background: var(--light, #FBFBFB);
        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);

        .button__full {
            width: 100% !important;
            height: 3rem !important;

            text-transform: uppercase;
        }
    }

    &-header {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-switch {
            cursor: pointer;
            margin: 0 1rem;
            margin-top: 1rem;
            transition: transform 0.3s ease;

            &:hover {
                transform: rotate(180deg);
            }

            &:active {
                transform: rotate(360deg);
                transition: transform 0.5s ease;
            }
        }

        .select,
        .select-modal,
        .select__selected,
        .select__items {
            width: 11rem;
        }
    }

    &-center {
        position: relative;
        margin: 1.7rem 0;

        .input-container {
            position: relative;
            width: 100%;

            input {
                width: 100%;
                height: 2.5rem;

                padding-right: 3rem;
                box-sizing: border-box;

                text-align: left;

                overflow: hidden;
                color: var(--gray, #A1A1A9);
                text-overflow: ellipsis;
                white-space: nowrap;

                font-size: 1.125rem;
                font-style: normal;
                font-weight: 500;
                line-height: 120%;

                color: black;

                &::-webkit-outer-spin-button,
                &::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                &[type=number] {
                    -moz-appearance: textfield;
                }
            }

            .max-button {
                position: absolute;
                right: 10px;

                top: 50%;
                transform: translateY(-50%);

                width: 3.5rem;
                height: 1.5rem;

                font-size: 0.8rem;
                line-height: 1rem;

                cursor: pointer;

                background: none;
                border: none;
                color: #fff;

                border-radius: 0.25rem;
                background: rgba(44, 110, 255, 0.70);

                &:hover {
                    background: rgba(44, 111, 255, 0.493);
                }

                &:disabled {
                    color: #fff;
                    background: var(--gray, #A1A1A9);
                }

                transition: .3s;
            }
        }

        .info-value-max {
            position: absolute;
            right: 0;
        }
    }

    &-info {
        margin: .5rem 0;
        margin-bottom: 1rem;

        .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            .info-label {
                flex-grow: 1;
                display: flex;
                align-items: center;

                &::after {
                    content: '';
                    flex-grow: 1;
                    margin-left: 0.5rem;
                    border-bottom: 1px dashed #CCC;
                }
            }

            .info-value {
                flex-shrink: 0;
                margin-left: 0.5rem;
                white-space: nowrap;

                color: black;
                font-weight: 600;

                &-usd {
                    font-weight: 500;
                    color: gray;
                }
            }
        }
    }
}
</style>