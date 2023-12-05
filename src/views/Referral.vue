<script setup lang="ts">
import { ref, computed, watch, onMounted, Ref } from 'vue'
import * as _ from 'lodash'

import { useToast } from 'vue-toastification'

import { ethers } from 'ethers'
import Config from '@/controllers/config'
import Evm, { ReferralStats } from '@/controllers/evm'

import CustomSelect from '@/components/Select.vue'

import Spinner from '../components/Spinner.vue'
import Toast from '../components/Toast.vue'

import copy_img from '/img/copy.svg'


const toast = useToast()
const showToast = (info, explorer = null) => toast({
    component: Toast,
    props: {
        info,
        explorer,
        close
    }
})

const loading = ref(null)
const connecting = ref(false)
const claiming = ref(false)

const wallet_connected = computed(() => Evm.isWalletConnected)
const wallet_data = computed(() => Evm.connectedWallet)
const wallet_address = computed(() => Evm.walletAddress)
const chain = computed(() => Evm.selectedChain)

const chains_selector: Ref<any[]> = ref([])


const ref_link = ref('')

const ref_stats: Ref<ReferralStats[]> = ref(null)

const ref_stats_chain_amount = ref('0')
const ref_stats_chain_tx = ref(0)

let clickTimeout;
const clickCount = ref(0)


async function conenctWallet() {
    connecting.value = true
    await Evm.toggleWallet()
    connecting.value = false
}

function calculateAvailableChains() {
    loading.value = true

    const availableChainsForClaim = ref_stats.value.filter(chain => chain.earnedAmount)
    if (!availableChainsForClaim.length) {
        chains_selector.value = Config.chainsConnect
        return
    }

    let chains_selector_arr = Config.chainsConnect.map(configChain => {
        if (availableChainsForClaim.some(chain => chain.chainId === configChain.id)) {
            return { ...configChain, availableForClaim: true }
        } else {
            return configChain
        }
    })

    chains_selector.value = chains_selector_arr
}

function getStatsForChain() {
    if (!ref_stats.value) {
        ref_stats_chain_amount.value = '0'
        ref_stats_chain_tx.value = 0
        return
    }

    try {
        const chainStats = ref_stats.value.find(chainStats => chainStats.chainId === chain.value.id)

        ref_stats_chain_amount.value = ethers.formatEther(BigInt(chainStats.earnedAmount).toString())
        if (ref_stats_chain_amount.value === '0.0') ref_stats_chain_amount.value = '0'

        ref_stats_chain_tx.value = chainStats.txCount
    } catch (error) {
        ref_stats_chain_amount.value = '0'
        ref_stats_chain_tx.value = 0
    }
}

function copyLink() {
    clickCount.value++

    if (clickCount.value > 3) {
        showToast('Super link copied 📣')
        clickCount.value = 0
        clearTimeout(clickTimeout)
    } else {
        navigator.clipboard.writeText(ref_link.value).then(() => {
            showToast('Link copied')
        }).catch(err => {
            showToast('Failed to copy link')
        })

        clearTimeout(clickTimeout)
        clickTimeout = setTimeout(() => {
            clickCount.value = 0
        }, 10000)
    }
}

async function update() {
    loading.value = true

    ref_link.value = 'zerius.io/?ref=' + Evm.convertAddress(wallet_address.value)
    ref_stats.value = await Evm.fetchReferralStats()

    getStatsForChain()
    calculateAvailableChains()

    loading.value = false
}

async function claim() {
    try {
        claiming.value = true

        const chainId = chain?.value?.id

        const { result, msg, receipt } = await Evm.claimReferralFee(toast)
        showToast(msg, { id: chainId, hash: receipt?.hash })

        claiming.value = false

        if (result) {
            await update()
        }
    } catch (error) {
        claiming.value = false
    }
}

onMounted(async () => {
    loading.value = true

    const waitForWalletData = async () => {
        while (!wallet_data.value) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
    }
    await waitForWalletData()

    await update()

    watch(() => wallet_connected.value, (newVal, oldVal) => {
        if (newVal !== oldVal && (newVal !== undefined || null)) {
            update()
        }
    })

    watch(() => wallet_address.value, (newVal, oldVal) => {
        if (newVal !== oldVal && (newVal !== undefined || null)) {
            update()
        }
    })

    watch(() => chain.value, (newVal, oldVal) => {
        if (newVal !== oldVal && (newVal !== undefined || null)) {
            update()
        }
    })

    loading.value = false
})
</script>

<template>
    <h1 style="max-width: 60%;">Earn with your referrals</h1>

    <div>
        <div v-if="!wallet_connected" class="refuel-container" style="margin-bottom: 1.5rem; padding-top: 1.5rem;">
            <h3>Connect wallet to get your refferal link</h3>

            <button @click="conenctWallet" class="button__full button__full-uppercase">
                Connect
                <Spinner v-if="connecting" />
            </button>
        </div>

        <div v-else class="refuel-container" style="margin-bottom: 1.5rem; padding-top: 2rem !important;">
            <h3>Share your referral link with friends</h3>

            <div class="input-container">
                <input :value="ref_link" class="referral-link-input" readonly>
                <img :src="copy_img" alt="Copy" class="copy-icon" @click="copyLink">
            </div>
        </div>

        <div v-if="wallet_connected" class="refuel-container" style="margin-top: 1.5rem; padding-top: 2rem !important;">
            <custom-select :options="chains_selector" :referral="true" class="select-modal refferal-select" />

            <div class="refuel-info">
                <div class="info-item">
                    <span class="info-label">Referral mints:</span>
                    <span :class="{ 'info-value': true, 'loading': loading }">{{ ref_stats_chain_tx }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Claimable amount:</span>
                    <span :class="{ 'info-value': true, 'loading': loading }">{{ ref_stats_chain_amount }}</span>
                </div>
            </div>

            <button @click="claim" class="button__full button__full-uppercase"
                :disabled="ref_stats_chain_amount === '0' || claiming">
                Claim
                <Spinner v-if="claiming" />
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.input-container {
    position: relative;
}

.referral-link-input {
    width: 100%;

    padding: .5rem;

    box-sizing: border-box;

    border-radius: 0;
    border-top: unset;
    border-left: unset;
    border-right: unset;

    font-weight: 600;
    font-size: medium;

    background-color: var(--light, #FBFBFB);
}

.copy-icon {
    position: absolute;
    top: 50%;
    right: .5rem;
    transform: translateY(-50%);

    cursor: pointer;
    filter: invert(49%) sepia(77%) saturate(5837%) hue-rotate(213deg) brightness(101%) contrast(102%);

    transition: transform 0.2s ease-out;

    &:not(:disabled):hover {
        transform: translateY(-70%);
    }

    &:disabled {
        &:hover {
            transform: none;
        }
    }
}

.refferal-select {
    margin: 1.5rem auto;

    color: black;

    border: unset;
    background-color: var(--light, #FBFBFB);
    box-shadow: unset;
}
</style>