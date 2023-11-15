<script setup lang="ts">
import { ref, computed, watch, onMounted, onUpdated, watchEffect } from 'vue'
import { useStore } from 'vuex'

import * as _ from 'lodash'

import { VueFinalModal } from 'vue-final-modal'
import { useToast } from 'vue-toastification'

const store = useStore()

import Config from '@/controllers/config'
import Evm from '@/controllers/evm'

import CustomSelect from '@/components/Select.vue'

import Spinner from '../components/Spinner.vue'
import Toast from '../components/Toast.vue'

import switch_img from '/img/switch.svg'


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

const _CHAINS = Config.chains
const _SETTINGS = Config.bridge


const isEvmWalletConnected = computed(() => Evm.isWalletConnected)
const evmConnectedWallet = computed(() => Evm.connectedWallet)
const selectedChain = computed(() => store.getters['evm/selectedChain'])


const from = ref(null)
const to = ref(null)

const fromRef = ref(null)
const toRef = ref(null)

const isLoading = ref(true)

const maxAmount = ref(0)

const userBalance = ref(0)

const refuelAmount = ref(null)
const refueling = ref(false)

const fromTokenPrice = ref(0)
const toTokenPrice = ref(0)

const estimatedTransferTime = ref('--')

const refuelFee = ref('-- $')
const refuelFeeValue = ref()
const finalRefuelFeeValue = ref()

const lzFee = ref('--')
const lzFeeUSD = ref('')

const expectedOutputValue = ref('--')
const expectedOutputValueUSD = ref('')

const getFromTokenSymbol = computed(() => {
    return fromRef.value?.selected?.token || ''
})

const getToTokenSymbol = computed(() => {
    return toRef.value?.selected?.token || ''
})

const placeholderValue = computed(() => `0 ${getFromTokenSymbol.value}`)

const userBalanceCalcValue = computed(() => {
    return normalizeValue(userBalance.value * fromTokenPrice.value, 2)
})

const isButtonDisabled = computed(() => {
    if (selectedChain.value?.id !== fromRef.value?.selected.id) return false

    return !isEvmWalletConnected.value ||
        refuelAmount.value <= 0 ||
        refueling.value ||
        maxAmount.value <= 0 ||
        refuelAmount.value > userBalance.value ||
        refuelAmount.value > maxAmount.value
})

const buttonLabel = computed(() => {
    if (!isEvmWalletConnected.value) return 'Connect wallet'
    if (selectedChain.value.id !== fromRef.value?.selected.id) return `Switch network to ${fromRef.value?.selected.label}`

    if (refuelAmount.value <= 0) return 'Enter amount'
    if (refuelAmount.value > userBalance.value) return 'Insufficient Balance'
    if (refuelAmount.value > maxAmount.value) return 'Amount too large'
    if (isLoading.value === false && maxAmount.value <= 0) return `Can't bridge to ${toRef.value?.selected.label}`
    if (refuelAmount.value <= userBalance.value) return 'Send'

    if (refueling.value) return 'Sending...'
})

const filteredOptions = computed(() => {
    const fromSelectedChain = fromRef?.value?.selected?.id || null

    let SELECT_CHAINS = []

    const block = Config.getChainById(fromSelectedChain)?.block || []
    if (block.includes(0)) {
        SELECT_CHAINS = []
    } else {
        SELECT_CHAINS = _CHAINS.filter((option) =>
            !_SETTINGS.disabled.includes(option.id) && !block.includes(option.id)
        )
    }

    return SELECT_CHAINS.filter((chain) => fromSelectedChain !== chain.id)
})

const updateBalance = async () => {
    console.log('updateBalance', isEvmWalletConnected.value, evmConnectedWallet.value)

    if (isEvmWalletConnected.value) {
        userBalance.value = normalizeValue(Number(await Evm.getBalance(true)))
    }
}

const updateTokenPrice = async () => {
    if (getFromTokenSymbol.value === getToTokenSymbol.value) {
        fromTokenPrice.value = await Evm.fetchPrice(getFromTokenSymbol.value)
        toTokenPrice.value = fromTokenPrice.value
        return
    }

    fromTokenPrice.value = await Evm.fetchPrice(getFromTokenSymbol.value)
    toTokenPrice.value = await Evm.fetchPrice(getToTokenSymbol.value)
}

//      (refuelAmount.value > maxAmount.value) ? maxAmount.value : refuelAmount.value

const calcValueInUSD = () => {
    let resultValue = 0

    if (getFromTokenSymbol.value === getToTokenSymbol.value) {
        resultValue = parseFloat(refuelAmount.value || 0) * toTokenPrice.value
    } else {
        resultValue = (parseFloat(refuelAmount.value || 0) * fromTokenPrice.value) * toTokenPrice.value
    }

    console.log('calclValueInUSD', getFromTokenSymbol.value, getToTokenSymbol.value, (parseFloat(refuelAmount.value || 0), fromTokenPrice.value), toTokenPrice.value, (parseFloat(refuelAmount.value || 0) * fromTokenPrice.value) * toTokenPrice.value)

    return resultValue && resultValue !== Infinity ? normalizeValue(resultValue) : '0'
}

const calcOutputValue = async () => {
    let outputValue = 0

    await getMaxAmountValue()

    if (getFromTokenSymbol.value === getToTokenSymbol.value) {
        outputValue = parseFloat(refuelAmount.value || 0)
    } else {
        outputValue = (parseFloat(refuelAmount.value || 0) * fromTokenPrice.value) * toTokenPrice.value
    }

    outputValue = (outputValue > maxAmount.value) ? maxAmount.value : outputValue

    console.log('calcOutputValue', maxAmount.value, normalizeValue(outputValue), refuelFeeValue.value.nativeFee, outputValue - Number(refuelFeeValue.value.nativeFee))

    if (getFromTokenSymbol.value === getToTokenSymbol.value) {
        finalRefuelFeeValue.value = Number(refuelFeeValue.value.nativeFee) - outputValue
    } else {
        finalRefuelFeeValue.value = Number(refuelFeeValue.value.nativeFee)
    }

    return normalizeValue(outputValue - finalRefuelFeeValue.value)
}

const getMaxAmountValue = async () => {
    maxAmount.value = Number(await Evm.getMaxTokenValueInDst(fromRef.value?.selected.id, toRef.value?.selected.id, true))
}

const calcFeeValueInUSD = (value: number) => {
    console.log('calcFeeValueInUSD', fromTokenPrice.value, value)
    return fromTokenPrice.value * value
}

const refuelFeeValueCalc = async () => {
    refuelFeeValue.value = await Evm.estimateRefuelFee(fromRef.value?.selected.id, toRef.value?.selected.id, refuelAmount.value)
}

const maxAmountCalc = computed(() => {
    let outputValue = maxAmount.value

    if (getFromTokenSymbol.value !== getToTokenSymbol.value) {
        outputValue = (maxAmount.value * toTokenPrice.value) / fromTokenPrice.value
    }

    return normalizeValue(outputValue || 0)
})

const maxAmountCalcUSD = computed(() => {
    return normalizeValue(maxAmount.value * toTokenPrice.value)
})

const estimatedTransferTimeCalc = () => {
    const transferTimeMap = {
        137: '~5min',
        1101: '~3min'
    }

    const selectedChainId = toRef.value?.selected?.id
    return transferTimeMap[selectedChainId] ? transferTimeMap[selectedChainId] : '~1min'
}

const updateInfoValues = _.debounce(async () => {
    if (refuelAmount.value > 0 && refuelAmount.value <= userBalance.value && refuelAmount.value <= maxAmount.value) {
        console.log('============================== UPDATE ==============================', refuelAmount.value)
        isLoading.value = true

        await updateTokenPrice()


        const valueInUSD = calcValueInUSD()

        await refuelFeeValueCalc()
        const outputValue = await calcOutputValue()

        const refuelZroFeeValueInUSD = calcFeeValueInUSD(finalRefuelFeeValue.value)


        if (maxAmount.value != 0) {
            estimatedTransferTime.value = estimatedTransferTimeCalc()
            refuelFee.value = `$0` // ${normalizeValue(refuelFeeValue.nativeFee)}

            lzFee.value = `${normalizeValue(finalRefuelFeeValue.value)} ${getFromTokenSymbol.value}` // ${refuelFeeValue * fromTokenPrice.value}
            lzFeeUSD.value = `$(${normalizeValue(refuelZroFeeValueInUSD, 2)})`

            expectedOutputValue.value = `${normalizeValue(outputValue)} ${getToTokenSymbol.value}`
            expectedOutputValueUSD.value = `${valueInUSD !== '0' ? `($${normalizeValue(valueInUSD, 2)})` : ''}`
        } else {
            defaultValues()
        }


        isLoading.value = false
    }
}, 500)

const normalizeValue = (value: number, unit = 5) => {
    return value !== null ? parseFloat(value.toFixed(unit)) : 0
}

const defaultValues = (() => {
    estimatedTransferTime.value = '--'
    refuelFee.value = '--'
    lzFee.value = `-- ${getToTokenSymbol.value}`
    expectedOutputValue.value = `-- ${getToTokenSymbol.value}`
})

const switchChains = () => {
    const temp = fromRef.value.selected
    fromRef.value.selected = toRef.value.selected
    toRef.value.selected = temp

    updateData()
}

const updateData = async () => {
    if (isEvmWalletConnected.value) {
        if (selectedChain.value && fromRef.value?.selected) fromRef.value.selected = selectedChain.value
        await updateTokenPrice()
        await updateBalance()
        await updateInfoValues()
        await getMaxAmountValue()
    }
}

const refuel = async () => {
    if (selectedChain.value.id !== fromRef.value?.selected.id) {
        await Evm.setChainById(fromRef.value?.selected.id)
        return
    }

    refueling.value = true

    const fromChainId = fromRef.value?.selected.id
    const toChainId = toRef.value?.selected.id

    const amount = refuelAmount.value.toString()

    console.log(fromChainId, toChainId, amount)

    const { result, msg, receipt } = await Evm.refuel(
        fromChainId,
        toChainId,
        amount,
        showToast
    )

    console.log('REFUEL', result, msg, receipt)

    refueling.value = false

    showToast(msg, { id: fromChainId, hash: receipt?.hash })

    await updateBalance()
}

onMounted(() => {
    updateData()
})


watch(isEvmWalletConnected, (newValue) => {
    if (newValue) {
        updateData()
    }
}, { immediate: true })


watchEffect(() => {
    updateInfoValues()
})

watch(refuelAmount, async () => {
    if (refuelAmount.value > 0 && refuelAmount.value <= userBalance.value) {
        updateInfoValues()
    } else {
        defaultValues()
    }
}, { immediate: true })

watch(selectedChain, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        if (fromRef.value?.selected) fromRef.value.selected = newValue
        updateInfoValues()
    }
})

watch(() => toRef?.value?.selected, (newValue, oldValue) => {
    if (newValue !== oldValue) updateInfoValues()
})
</script>

<template>
    <h1 style="max-width: 60%;">Refuel via LayerZero</h1>

    <div class="refuel-container">
        <div class="refuel-header">
            <div class="flex column" style="justify-content: flex-start; align-items: flex-start;">
                <div>From</div>
                <custom-select ref="fromRef" class="select-modal" :options="Config.chains" v-model="from" :isolate="true"
                    :initialChainId="selectedChain?.id" />
            </div>

            <img @click="switchChains" :src="switch_img" alt="switch" class="refuel-header-switch">

            <div class="flex column" style="justify-content: flex-start; align-items: flex-start;">
                <div>To</div>
                <custom-select ref="toRef" class="select-modal" :options="filteredOptions" v-model="to" :isolate="true"
                    :initialChainId="selectedChain?.id" />
            </div>
        </div>

        <div class="refuel-center">
            <div class="flex">
                <div>Refuel amount</div>
                <div class=flex>
                    <div>Balance: {{ userBalance }}</div>
                    <!-- <div v-if="userBalanceCalcValue" style="margin-left: .5rem;">(${{ userBalanceCalcValue }})</div> -->
                </div>
            </div>

            <div class="input-container">
                <input v-model="refuelAmount" :placeholder="placeholderValue" type="number" min="0">
                <button :disabled="userBalance <= 0" @click="() => refuelAmount = userBalance"
                    :class="{ 'max-button': true, 'loading': isLoading }">MAX</button>
            </div>

            <span class="info-value-max" v-if="maxAmountCalc">
                Max refuel: {{ maxAmountCalc }}
                <!-- <span v-if="maxAmountCalcUSD">(${{ maxAmountCalcUSD }})</span> -->
            </span>
        </div>

        <div class="refuel-info">
            <div class="info-item">
                <span class="info-label">Estimated Transfer Time:</span>
                <span :class="{ 'info-value': true, 'loading': isLoading }">{{ estimatedTransferTime }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Refuel Fee:</span>
                <span :class="{ 'info-value': true, 'loading': isLoading }">{{ refuelFee }}</span>
            </div>
            <div class="info-item">
                <span class="info-label">LayerZero Fee:</span>
                <span :class="{ 'info-value': true, 'loading': isLoading }">
                    {{ lzFee }}
                    <span class="info-value-usd">{{ lzFeeUSD }}</span>
                </span>
            </div>
            <div class="info-item">
                <span class="info-label">Expected Output:</span>
                <span :class="{ 'info-value': true, 'loading': isLoading }">
                    {{ expectedOutputValue }}
                    <span class="info-value-usd">{{ expectedOutputValueUSD }}</span>
                </span>
            </div>
        </div>

        <button @click="refuel" :disabled="isButtonDisabled" class="button__full">
            {{ buttonLabel }}
            <Spinner v-if="refueling" />
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

            &:hover {
                transform: rotate(180deg);
            }

            &:active {
                transform: rotate(-180deg);
                transition: .3s;
            }

            transition: .3s;
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