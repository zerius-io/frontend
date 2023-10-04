<template>
    <div class="custom-select" :tabindex="tabindex" @blur="open = false">
        <div class="selected" :class="{ open: open }" @click="open = !open">
            <img :src="getChainImage(selected?.label)" alt="icon" style="width: 1rem; height: 1rem;" />
            {{ selected?.label }}
        </div>
        <div class="items" :class="{ selectHide: !open }">
            <div v-for="(option, i) of options" :key="i" @click="selectOption(option)">
                <img :src="getChainImage(option?.label)" alt="icon" style="width: 1rem; height: 1rem;" />
                {{ option?.label }}
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
        default: {
            type: String,
            required: false,
            default: null,
        },
        tabindex: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    data() {
        return {
            selected: this.default
                ? this.default
                : this.options.length > 0
                    ? this.options[0]
                    : null,
            open: false,
        }
    },
    mounted() {
        this.$emit("input", this.selected)
    },
    methods: {
        selectOption(option) {
            this.selected = option
            this.open = false
            this.$emit("input", option)
        },
        async getChainImage(chainName) {
            try {
                // Use a function to construct the import path dynamically
                const imagePath = `./src/assets/img/chains/${chainName.toLowerCase()}.svg`
                const imageModule = await import(imagePath)
                return imageModule.default
            } catch (error) {
                console.error(`Error loading SVG for ${chainName}:`, error)
                return ''
            }
            // try {
            //     return `./src/assets/img/chains/${chainName.toLowerCase()}.svg`
            // } catch (error) {
            //     console.error(`Error loading SVG for ${chainName}:`, error)
            //     return ''
            // }
        },
    },
}
</script>
  
<style scoped>
/* Your CSS styles remain the same */
</style>
  
  
<style scoped>
.custom-select {
    position: relative;
    width: 100%;
    text-align: left;
    outline: none;
    height: 47px;
    line-height: 47px;
}

.custom-select .selected {
    /* background-color: #0a0a0a; */
    border-radius: 6px;
    border: 1px solid #666666;
    /* color: #fff; */
    padding-left: 1em;
    cursor: pointer;
    user-select: none;
}

.custom-select .selected.open {
    /* border: 1px solid #ad8225; */
    border-radius: 6px 6px 0px 0px;
}

.custom-select .selected:after {
    position: absolute;
    content: "";
    top: 22px;
    right: 1em;
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-color: var(--blue, #2C6EFF) transparent transparent transparent;
}

.custom-select .items {
    color: black;
    border-radius: 0px 0px 6px 6px;
    overflow: hidden;
    /* border-right: 1px solid #ad8225;
    border-left: 1px solid #ad8225;
    border-bottom: 1px solid #ad8225; */
    position: absolute;
    left: 0;
    right: 0;
    z-index: 10000;

    background: rgba(255, 255, 255, 0.795);
    backdrop-filter: blur(5px);
}

.custom-select .items div {
    color: black;
    padding-left: 1em;
    cursor: pointer;
    user-select: none;
}

.custom-select .items div:hover {}

.selectHide {
    display: none;
}
</style>
  