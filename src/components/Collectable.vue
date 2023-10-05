<template>
    <div>
        <!-- Your Collectable component content goes here -->
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Collectable',
    props: {
        items: {
            type: Array,
            required: true,
        },
    },
})
</script>
  
<style lang="scss"></style>