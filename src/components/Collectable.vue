<script setup lang="ts">
import { ModalsContainer, useModal } from 'vue-final-modal'
import Modal from './Modal.vue'

import Zerius from './config'

import blank from '/img/blank.png'
import arrow from '/img/arrow.svg'

const props = defineProps(['item', 'clickable'])

const modalOptions = {
    title: 'Send',
    collectable: props.item,
}

const { open, close, patchOptions } = useModal({
    component: Modal,
    attrs: modalOptions,
    slots: {},
})

patchOptions({
    attrs: {
        ...modalOptions,
        close
    }
})

const getChainIconSrc = (chainId: number) => {
    const chain = Zerius.getChainById(chainId)
    return `/img/chains/${chain?.icon ? chain.icon : `${chain.label.toLowerCase()}.svg`}`
}
</script>

<template>
    <div class="collectable-item" v-on="clickable ? { click: open } : {}">
        <img :src="item?.uri ? item.uri : blank" class="collectable-item-img" />
        <div class="collectable-item-info flex">
            <img :src="getChainIconSrc(item?.chainId)" class="collectable-item-info-chain" />
            <div class="collectable-item-info-text">minis #{{ item?.id }}</div>
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

@media screen and (max-width: 1050px) {
    .collectable-item {
        margin: .5rem;

        width: 10rem;

        &-img {
            height: 10rem;
        }
    }
}
</style>