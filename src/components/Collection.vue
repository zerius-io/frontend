<template>
    <h1 style="margin: 3rem auto">Your collection{{ collection.length ? '' : 'will be here' }}</h1>
    <Collectable :items="collection" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Collectable from './Collectable.vue'

import { ethers } from 'ethers'

export default defineComponent({
    name: 'Collection',
    data() {
        return {
            collection: [],
            items: {
                type: Array,
                required: true,
            },
        }
    },
    components: {
        Collectable,
    },
})
</script>

<style lang="scss"></style>