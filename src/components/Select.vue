<template>
    <div class="select" @blur="open = false" :class="{ open: open }">
        <div class="select__selected" :class="{ open: open }" @click="open = !open">
            <template v-if="selected">
                <img :src="getImageSrc(selected)" class="select__icon" />
            </template>
            {{ selected.label }}
        </div>

        <div class="select__items" :class="{ select__hide: !open }">
            <div v-for="(option, i) of filteredOptions" :key="i" @click="selectOption(option)" class="select__items-item">
                <img :src="getImageSrc(option)" class="select__icon" />
                {{ option.label }}
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { ref, computed, toRaw } from 'vue'

export default {
    props: {
        options: {
            type: Array,
            required: true,
        }
    },
    setup(props, { emit }) {
        const open = ref(false)

        const selected = ref(props.options[0] || null)
        const filteredOptions = computed(() => {
            return props.options.filter((option) => option !== selected.value)
        })

        const selectOption = (option) => {
            selected.value = option
            open.value = false

            emit('change')
            emit('input', option)
        }

        const getImageSrc = (chain) => {
            return `./src/assets/img/chains/${chain.icon ? chain.icon : `${chain.label.toLowerCase()}.svg`}`
        }

        return {
            selected,
            open,
            filteredOptions,
            selectOption,
            getImageSrc,
        }
    },
}
</script>

<style lang="scss">
.select {
    margin: 0 1.5rem;

    position: relative;
    text-align: left;
    outline: none;

    // display: flex;
    width: 11.25rem;
    line-height: 3rem;

    align-items: center;
    gap: 1rem;

    color: var(--blue, #2C6EFF);
    font-weight: 500;

    z-index: 10;

    border-radius: 0.75rem;
    border: 1px solid #2C6EFF;
    background: rgba(255, 255, 255, 0.50);
    box-shadow: 0px 0px 8px 0px rgba(205, 218, 252, 0.20);
    backdrop-filter: blur(3px);

    &__hide {
        display: none;
    }

    &__selected {
        display: flex;
        align-items: center;

        padding-left: 1rem;

        border-radius: 6px;

        cursor: pointer;
        user-select: none;

        transition: .3s;

        // &:hover {
        //     transform: scale(1.05);
        // }

        &:after {
            content: "";
            position: absolute;
            top: 50%;
            /* Adjust as needed */
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
        overflow-y: scroll;

        &::-webkit-scrollbar {
            width: 5px;
        }

        &::-webkit-scrollbar-track {
            // box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }

        &::-webkit-scrollbar-thumb {
            // background: rgba(255, 255, 255, 0.90);
            // outline: 1px solid slategrey;
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
            display: flex;
            align-items: center;

            color: black;
            padding-left: 1em;
            cursor: pointer;
            user-select: none;
        }
    }

}
</style>
  