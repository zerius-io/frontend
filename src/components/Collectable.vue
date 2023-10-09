<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import Modal from './Modal.vue'

import Zerius from './config'

import arrow from '/img/arrow.svg'

const props = defineProps(['item', 'clickable'])

const { open, close } = useModal({
    component: Modal,
    attrs: {
        title: 'Bridge',
        collectable: props.item,
        onConfirm() {
            // close()
        },
    },
    slots: {
        // default: '<p>The content of the modal</p>',
    },
})

const itemImageSrc = (item) => {
    const url = `./src/assets/img/carousel/test.jpg` //`https://example.com/path/to/collectable/images/${item.chainId}/${item.uri}`

    // const response = await fetch(url)
    // const blob = await response.blob()
    // return URL.createObjectURL(blob)
    return url
}

const getChainIconSrc = (chainId: number) => {
    const chain = Zerius.getChainById(chainId)
    return `./src/assets/img/chains/${chain?.icon ? chain.icon : `${chain.label.toLowerCase()}.svg`}`
}
</script>

<template>
    <div class="collectable-item" v-on="clickable ? { click: open } : {}">
        <img :src="itemImageSrc(item)" class="collectable-item-img" />
        <div class="collectable-item-info flex">
            <img :src="getChainIconSrc(item.chainId)" class="collectable-item-info-chain" />
            <div class="collectable-item-info-text">minis #{{ item.id }}</div>
            <img v-if="clickable" :src="arrow" />
        </div>

        <ModalsContainer />
    </div>
</template>
  
<style lang="scss">
.collectables {
    justify-content: center;
}

.collectable-item {
    margin: 1rem;
    width: 12.5rem;

    cursor: pointer;

    &-info {
        justify-content: center;

        margin: 0 auto;
        margin-top: -.5rem;
        padding: 0.75rem 1rem;

        border-radius: 0rem 0rem 0.75rem 0.75rem;
        background: rgba(255, 255, 255, 0.80);
        backdrop-filter: blur(12px);

        box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.15);

        &-chain {
            width: 1.5rem;
            height: 1.5rem;
        }

        &-text {
            margin: 0 1rem;

            color: var(--dark, #18181B);

            font-size: 1.125rem;
            font-style: normal;
            font-weight: 600;
            line-height: 120%;
        }
    }

    &-img {
        width: 100%;
        height: 13.3125rem;

        border-radius: 1.5rem 1.5rem 0rem 0rem;
        object-fit: cover;
    }
}
</style>