<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

import Collectable from './Collectable.vue'

import store from '@/store'
import Evm from './evm'

const collection = ref([])

const connectedWallet = computed(() => store.getters['wallet/connectedWallet'])
const selectedChain = computed(() => store.getters['wallet/selectedChain'])
const isCollectionNeedUpdate = computed(() => store.getters['wallet/collection'])

onMounted(async () => {
    await Evm.wait(1000)
    await fetchCollection()
})

watch(connectedWallet, async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) await fetchCollection()
})

watch(selectedChain, async (newVal, oldVal) => {
    await Evm.wait(5000)
    if (newVal && newVal !== oldVal) await fetchCollection()
})

watch(isCollectionNeedUpdate, async (newVal, oldVal) => {
    await fetchCollection()
})

const fetchCollection = async () => {
    collection.value = await Evm.collection()
}
</script>

<template>
    <div style="margin: 2.8rem auto; margin-top: 3.5rem">
        <div class="flex collectables">
            <Collectable v-for="item in collection" :key="item?.id" :item="item" :clickable="true" />
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
</style>