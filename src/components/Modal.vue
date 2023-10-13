<script setup lang="ts">
import { ref } from 'vue'

import { VueFinalModal } from 'vue-final-modal'
import { useToast } from 'vue-toastification'

import ok_img from '/img/ok.svg'
import error_img from '/img/error.svg'

import Evm from './evm'
import Zerius from './config'

import CustomSelect from "./Select.vue"
import Collectable from './Collectable.vue'

import Spinner from '../components/Spinner.vue'
import Toast from '../components/Toast.vue'

const { title, collectable } = defineProps<{
    title?: string,
    collectable?: any,
    close: any
}>()

const emit = defineEmits<{
    (e: 'confirm'): void
}>()

const selectedChain = ref(null)
const selectedChainRef = ref(null)

const bridging = ref()

const res = ref(null)

const toast = useToast()
const showToast = (info, explorer = null) => toast({
    component: Toast,
    props: {
        info,
        explorer,
        close
    }
})

async function bridge() {
    bridging.value = true

    // TODO  const { result, msg, receipt } =
    res.value = await Evm.bridge(
        collectable.id,
        collectable.chainId,
        selectedChainRef.value?.selected?.id,
        showToast
    )

    bridging.value = false
    showToast(res.value.msg, { id: selectedChainRef.value?.selected?.id, hash: res.value.receipt?.hash })
}
</script>

<template>
    <VueFinalModal class="modal flex" content-class="modal-content" overlay-transition="vfm-fade"
        content-transition="vfm-fade">

        <h1>{{ !res ? title : res?.result ? 'Success!' : 'Something went wrong :(' }}</h1>

        <custom-select v-if="title === 'Send'" ref="selectedChainRef" :options="Zerius.chains" v-model="selectedChain"
            :isolate="true" :initialChainId="collectable.chainId" />

        <slot />

        <div v-if="res !== null">
            <img class="status" alt="status" :src="res?.result ? ok_img : error_img" />

            <div class="flex" style="flex-direction: column;">
                <button v-if="title === 'Send'" @click="bridge" :disabled="bridging" class="button__full">
                    {{ bridging ? 'Sending' : 'Send' }} {{ res?.result && !bridging ? '' : 'again' }}
                    <Spinner v-if="bridging" />
                </button>
            </div>
        </div>
        <div v-else>
            <Collectable :item="collectable" :clickable="false" />

            <button v-if="title === 'Send'" @click="bridge" :disabled="bridging" class="button__full">
                {{ bridging ? 'Sending' : 'Send' }}
                <Spinner v-if="bridging" />
            </button>
        </div>

        <div v-if="title === 'Yay, congratulations!'">
            <button class="button__full" @click="close">Mint again</button>
        </div>
    </VueFinalModal>
</template>

<style lang="scss">
.modal {
    display: flex;
    justify-content: center;
    align-items: center;

    &-content {
        display: flex;
        flex-direction: column;

        padding: 1.5rem 1.5rem;

        background: #fff;
        border-radius: 1.5rem;

        &->*+* {
            margin: 0.5rem 0;
        }

        h1 {
            margin: 1rem auto;

            font-size: 1.125rem;
            font-style: normal;
            font-weight: 600;

            line-height: 80%;

            color: var(--dark, #18181B);
        }

        .status {
            margin: .8rem;

            width: 12.6875rem;
            height: 12.6875rem;
        }

        button {
            margin: .5rem auto;
            padding: 0.5rem 1.5rem;

            width: 12.5rem;
            height: 3rem;
            // padding: 0 8px;
            // border: 1px solid;
            // border-radius: 0.5rem;
        }
    }
}
</style>
