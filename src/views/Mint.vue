<template>
    <h1 style="max-width: 60%;">Mint NFTs and collect it in one place via LayerZero technologies</h1>

    <Carousel />

    <button class="button__full" style="margin-top: 1rem;">mint</button>

    <h1 style="margin: 3rem auto">Your collection will be here</h1>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'

import Carousel from '../components/Carousel.vue'


export default defineComponent({
    name: 'Mint',
    components: {
        Carousel
    }
})
</script>
  
<style lang="scss"></style>
  