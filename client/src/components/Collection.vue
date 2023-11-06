<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import _ from 'lodash'

import Collectable from './Collectable.vue'

import store from '@/store'
import Evm, { CollectionItem } from '@/controllers/evm'
import UTILS from '@/controllers/utils'
import Starknet from '@/controllers/starknet'


const STORAGE_NAME = 'ZeriusCollection'

const collection = ref([])

const connectedWallet = computed(() => store.getters['evm/connectedWallet'])
const selectedChain = computed(() => store.getters['evm/selectedChain'])
const isCollectionNeedUpdate = computed(() => store.getters['evm/collection'])

onMounted(async () => {
    await UTILS.wait(1000)
    await initCollection()
})

watch(connectedWallet, async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) await fetchCollection()
})

// watch(selectedChain, async (newVal, oldVal) => {
//     await UTILS.wait(5000)
//     if (newVal && newVal !== oldVal) await fetchCollection()
// })

watch(isCollectionNeedUpdate, async (newVal, oldVal) => {
    // console.log('UPDATE', newVal)
    await fetchCollection(newVal)
})


const initCollection = async () => {
    const storedData = getFromLocalStorage()
    // console.log('storedData', storedData)

    if (Evm.isWalletConnected || Starknet.isWalletConnected) {
        if (storedData && !isCollectionExpired(storedData.timestamp)) {
            if (Evm.isWalletConnected && !Starknet.isWalletConnected) {
                collection.value = storedData.collection.filter((item: CollectionItem) => item.chainId != null)
            }

            if (!Evm.isWalletConnected && Starknet.isWalletConnected) {
                collection.value = storedData.collection.filter((item: CollectionItem) => item.chainId == null)
            }

            if (Evm.isWalletConnected && Starknet.isWalletConnected) {
                collection.value = storedData.collection
            }
        } else {
            await fetchCollection()
        }
    }
}

const fetchCollection = async (item?: CollectionItem) => {
    let newItems = []

    if (item) {
        newItems = [item]
    } else {
        newItems = await Evm.collection()
    }

    // console.log('FETCH COLLECTION', newItems, collection.value)

    const updatedCollection = _.unionBy(newItems, collection.value, 'id').flat().sort((a, b) => a.id - b.id)

    // console.log('updatedCollection', updatedCollection)

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
    // Check if the timestamp is older than 1 hour
    return Date.now() - timestamp > 3600000
}
</script>

<template>
    <div style="margin: 2.8rem auto; margin-top: 3.5rem">
        <div class="flex collectables">
            <transition name="fade" v-for="item in collection" :key="item?.id">
                <Collectable :item="item" :clickable="true" />
            </transition>
        </div>

        <!-- <div style="margin: 1.5rem 0 auto">
            {{ collection.length }} Minis
        </div> -->
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