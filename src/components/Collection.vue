<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

import Collectable from './Collectable.vue'

import store from '@/store'
import Evm from './evm'

const collection = ref([])

const connectedWallet = computed(() => store.getters['wallet/connectedWallet'])

onMounted(async () => {
    await fetchCollection()
})

watch(connectedWallet, async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) await fetchCollection()
})

const fetchCollection = async () => {
    collection.value = await Evm.collection()
}
</script>

<template>
    <div style="margin: 2.8rem auto; margin-top: 3.5rem">
        <!-- <h1>Your collection{{ collection.length ? '' : ' will be here' }}</h1> -->
        <div class="flex collectables">
            <Collectable v-for="item in collection" :key="item.id" :item="item" :clickable="true" />
        </div>
    </div>
</template>

<style lang="scss">
h1 {
    margin: 2rem auto;
}
</style>