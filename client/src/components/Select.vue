<script lang="ts">
import { ref, computed, onMounted, watchEffect, watch } from 'vue'
import { useStore } from 'vuex'

import Config from '@/controllers/config'
import Evm from '@/controllers/evm'

export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
        initialChainId: {
            type: Number,
            default: null
        },
        isolate: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const store = useStore()

        const open = ref(false)
        const selectRef = ref(null)
        const selected = ref(Config.chains[0] || null)

        const filteredOptions = computed(() => {
            const walletSelectedChain = store.state.evm.selectedChain?.id || null

            if (props.isolate) {
                // TODO CHANGE
                const block = Config.getChainById(walletSelectedChain)?.block || []

                if (block.includes(0)) {

                }

                return Config.chains.filter((option) =>
                    !block.includes(option.id)
                )
            }

            return Config.chains
        })

        const isDisabled = computed(() => {
            if (props.isolate) {
                if (props.initialChainId == null) return true
                // const walletSelectedChain = store.state.evm.selectedChain?.id || null
                // console.log(walletSelectedChain, walletSelectedChain === null)
                // if (walletSelectedChain === null) return true

                // const block = Config.getChainById(walletSelectedChain)?.block || []
                // return block.includes(0)
            }

            return false
        })

        const selectRandomChain = () => {
            const availableOptions = props.initialChainId !== null
                ? filteredOptions.value.filter(option => option.id != props.initialChainId)
                : filteredOptions.value

            const randomIndex = Math.floor(Math.random() * availableOptions.length)
            return availableOptions[randomIndex]
        }

        const selectOption = (option) => {
            selected.value = option
            open.value = false

            if (!props.isolate) {
                store.commit('evm/setSelectedChain', selected.value)
            }

            emit('change')
            emit('input', option)
        }

        const getImageSrc = (chain) => {
            return `/img/chains/${chain.icon ? chain.icon : `${chain.label.toLowerCase()}.svg`}`
        }

        onMounted(() => {
            if (props.initialChainId !== null) {
                selected.value = selectRandomChain()
            }
        })

        if (!props.isolate) {
            watch(() => store.getters['evm/overwriteChain'], (newValue, oldValue) => {
                const retryCount = ref(0)

                const executeLogic = () => {
                    if (newValue !== oldValue) {
                        const chainObj = Config.getChainById(Evm.walletChainId)

                        if (chainObj) selected.value = chainObj
                        store.commit('evm/setOverwriteChain', false)
                        store.commit('evm/setSelectedChain', selected.value)
                    }
                }

                const retryLogic = () => {
                    if (Evm.isWalletConnected || retryCount.value >= 10) {
                        if (!Evm.isWalletConnected) return

                        executeLogic()
                    } else {
                        retryCount.value++;
                        setTimeout(retryLogic, 500)
                    }
                }

                retryLogic()
            })
        }

        watchEffect(() => {
            const handleClickOutside = (event) => {
                if (selectRef.value && !selectRef.value.contains(event.target)) {
                    open.value = false
                }
            }

            document.addEventListener('click', handleClickOutside)

            return () => {
                document.removeEventListener('click', handleClickOutside)
            }
        })

        return {
            selected,
            open,
            filteredOptions,
            selectOption,
            getImageSrc,
            selectRef,
            isDisabled
        }
    }
}
</script>

<template>
    <div class="select" @blur="open = false" :class="{ open: open, 'disabled-pointer': isDisabled }" ref="selectRef"
        :disabled="isDisabled">
        <div class="select__selected" :class="{ open: open, 'disabled-pointer': isDisabled }" @click="open = !open">
            <template v-if="selected">
                <img :src="getImageSrc(selected)" class="select__icon" />
            </template>
            {{ selected.label }}
        </div>
        <div class="select__items" :class="{ select__hide: !open }">
            <div v-for="(option, i) of filteredOptions" :key="i" @click="selectOption(option)" class="select__items-item">
                <img :src="getImageSrc(option)" class="select__icon" />
                {{ option.label }}
                <span v-if="option.new" class="new-tip">new</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.select {
    margin: 0 auto;

    &-modal {
        margin: 0 auto !important;
    }

    position: relative;

    width: 11.25rem;

    align-items: center;
    gap: 1rem;

    color: var(--blue, #2C6EFF);
    text-align: left;
    line-height: 3rem;
    font-weight: 500;

    z-index: 10;

    border-radius: 0.75rem;
    border: 1px solid #2C6EFF;
    background: rgba(255, 255, 255, 0.50);
    box-shadow: 0px 0px 8px 0px rgba(205, 218, 252, 0.20);
    backdrop-filter: blur(3px);

    outline: none;

    &__hide {
        display: none;
    }

    &__selected {
        display: flex;
        align-items: center;

        padding-left: .8rem;

        border-radius: 6px;

        cursor: pointer;
        user-select: none;

        transition: .3s;

        &:after {
            content: "";
            position: absolute;
            top: 50%;
            right: 1rem;

            width: 0;
            height: 0;

            border-style: solid;
            border-width: 5px 5px 0 5px;
            border-color: var(--blue, #2C6EFF) transparent transparent transparent;

            transform: translateY(-50%);
            transition: .3s;
        }

        .open {}
    }

    &.open {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    &__selected.open {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    &__selected.open:after {
        transform: translateY(-50%) rotate(180deg)
    }

    &__icon {
        margin: 0 .6rem;
        margin-left: 0;

        width: 1.5rem;
        height: 1.5rem;
    }

    &__items {
        color: black;
        border-radius: 0px 0px 6px 6px;

        width: 11.25rem;

        max-height: 15rem;

        overflow-x: hidden;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-track {}

        &::-webkit-scrollbar-thumb {
            background: rgba(179, 179, 179, 0.9);
            border-radius: .85rem;
        }

        position: absolute;
        left: -1px;
        right: 0;

        border-radius: 0.75rem;
        border: 1px solid #2C6EFF;
        background: rgba(255, 255, 255, 0.90);
        backdrop-filter: blur(18px);

        border-radius: 0.75rem;
        border-top-left-radius: 0;
        border-top-right-radius: 0;

        border-top: none;

        &-item {
            position: relative;

            display: flex;
            align-items: center;

            color: black;
            padding-left: .8rem;
            cursor: pointer;
            user-select: none;

            transition: .3s all;

            &:hover {
                background: rgba(255, 255, 255, 1);
            }
        }
    }

}

.disabled-pointer {
    pointer-events: none !important;

    border: 1px solid #D4D4D4;
    color: #D4D4D4;

    background: rgba(255, 255, 255, 0.50);

    box-shadow: 0px 0px 8px 0px rgba(205, 218, 252, 0.20);
    backdrop-filter: blur(3px);

    .select,
    .select__selected:after {
        border-color: #D4D4D4 transparent transparent transparent;
    }
}
</style>