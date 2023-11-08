<script setup lang="ts">
import { ref, onMounted, computed, watch, Ref } from 'vue'
import _ from 'lodash'

import Collectable from './Collectable.vue'

import store from '@/store'
import Evm, { CollectionItem } from '@/controllers/evm'
import UTILS from '@/controllers/utils'
import Starknet from '@/controllers/starknet'


const STORAGE_NAME = 'ZeriusCollection'

const STARKNET_CHAIN_ID = 2344859429196833

const collection: Ref<CollectionItem[]> = ref([])

const isCollectionNeedUpdate = computed(() => store.getters['evm/collection'])

const evmConnectedWallet = computed(() => Evm.connectedWallet)
const starknetConnectedWallet = computed(() => Starknet.connectedWallet)

const selectedChainValue = computed(() => store.getters['evm/selectedChain'])

onMounted(async () => {
    await UTILS.wait(1000)
    await initCollection()
})

watch(evmConnectedWallet, async (newVal, oldVal) => {
    if (newVal?.accounts[0]?.address !== oldVal?.accounts[0]?.address) await fetchCollection()
})

watch(starknetConnectedWallet, async (newVal, oldVal) => {
    if (newVal !== oldVal) await fetchCollection()
})

watch(selectedChainValue, async (newVal, oldVal) => {
    if (newVal !== oldVal) await fetchCollection(...collection.value || [])
})

watch(isCollectionNeedUpdate, async (newVal, oldVal) => {
    await fetchCollection(newVal)
})


const initCollection = async () => {
    const storedData = getFromLocalStorage()
    // console.log('storedData', storedData)

    if (Evm.isWalletConnected || Starknet.isWalletConnected) {
        if (storedData && !isCollectionExpired(storedData.timestamp)) {
            if (Evm.isWalletConnected && !Starknet.isWalletConnected) {
                collection.value = storedData.collection.filter((item: CollectionItem) => item.chainId != STARKNET_CHAIN_ID)
            }

            if (!Evm.isWalletConnected && Starknet.isWalletConnected) {
                collection.value = storedData.collection.filter((item: CollectionItem) => item.chainId == STARKNET_CHAIN_ID)
            }

            if (Evm.isWalletConnected && Starknet.isWalletConnected) {
                collection.value = storedData.collection
            }
        } else {
            await fetchCollection()
        }
    }
}

async function fetchCollection(item?: CollectionItem) {
    const newItems = (item) ? [item] : await Evm.collection()

    let updatedCollection = newItems

    if (newItems && newItems.length) {
        const selectedChainId = selectedChainValue.value?.id

        updatedCollection = _.unionBy(newItems, collection.value, 'id')
            .flat()
            .sort((a, b) => {
                if (selectedChainId) {
                    if (a.chainId === selectedChainId && b.chainId !== selectedChainId) {
                        return -1
                    }
                    if (b.chainId === selectedChainId && a.chainId !== selectedChainId) {
                        return 1
                    }
                }

                return a.id - b.id
            })
    }

    collection.value = updatedCollection
    saveToLocalStorage(updatedCollection)
}

const saveToLocalStorage = (collectionData: CollectionItem[]) => {
    try {
        const dataToStore = {
            timestamp: Date.now(),
            collection: collectionData.flat()
        }
        const jsonData = JSON.stringify(dataToStore)
        localStorage.setItem(`${STORAGE_NAME}`, jsonData)
    } catch (error) {
        // console.error('Failed to save to local storage:', error)
    }
}

const getFromLocalStorage = () => {
    try {
        const jsonData = localStorage.getItem(`${STORAGE_NAME}`)
        return jsonData ? JSON.parse(jsonData) : null
    } catch (error) {
        // console.error('Failed to get from local storage:', error)
        return null
    }
}

const isCollectionExpired = (timestamp) => {
    return Date.now() - timestamp > 3600000
}

const countChains = computed(() => {
    const chainIdsSet = new Set()
    collection.value.forEach((item) => chainIdsSet.add(item.chainId))

    return chainIdsSet.size
})
</script>

<template>
    <div style="margin: 2.8rem auto; margin-top: 3.5rem">
        <div class="flex collectables">
            <transition name="fade" v-for="item in collection" :key="item?.id">
                <Collectable :item="item" :clickable="true" />
            </transition>
        </div>

        <div v-if="collection?.length" style="margin: 1.5rem 0 auto">
            Minis: {{ collection.length }} | Chains: {{ countChains }}
        </div>
    </div>
</template>

<style lang="scss">
h1 {
    margin: 2rem auto;
}

.collectables {
    flex-wrap: wrap;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease-out;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>