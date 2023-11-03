<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

import Collectable from './Collectable.vue'

import store from '@/store'
import Evm from '@/controllers/evm'
import UTILS from '@/controllers/utils'

const collection = ref([])

const connectedWallet = computed(() => store.getters['evm/connectedWallet'])
const selectedChain = computed(() => store.getters['evm/selectedChain'])
const isCollectionNeedUpdate = computed(() => store.getters['evm/collection'])

onMounted(async () => {
    await UTILS.wait(1000)
    await fetchCollection()
})

watch(connectedWallet, async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) await fetchCollection()
})

watch(selectedChain, async (newVal, oldVal) => {
    await UTILS.wait(5000)
    if (newVal && newVal !== oldVal) await fetchCollection()
})

watch(isCollectionNeedUpdate, async (newVal, oldVal) => {
    await fetchCollection()
})

const fetchCollection = async () => {
    collection.value = await Evm.collection()
}
// const fetchCollection = async () => {
//     const uniqueIds = new Set(collection.value.map(item => item.id))

//     for await (const item of Evm.collection()) {
//         if (!uniqueIds.has(item.id)) {
//             collection.value.push(item)
//             uniqueIds.add(item.id)
//         }
//     }
// }
</script>

<template>
    <div style="margin: 2.8rem auto; margin-top: 3.5rem">
        <div class="flex collectables">
            <transition name="fade" v-for="item in collection" :key="item?.id">
                <Collectable :item="item" :clickable="true" />
            </transition>
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