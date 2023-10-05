<template>
    <div class="carousel__wrapper">
        <Carousel :itemsToShow="5" :wrapAround="true" :transition="500" :disable-user-scroll="true" ref="carousel">
            <Slide v-for="(image, index) in images" :key="index">
                <img :src="image" alt="nft" class="carousel__item" />
            </Slide>
        </Carousel>
    </div>
</template>
  
<script lang="js">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

export default defineComponent({
    name: 'AutoPlayCarousel',
    components: {
        Carousel,
        Slide
    },
    data() {
        return {
            images: [], // Array to store image URLs
            autoScrollInterval: null, // Interval for auto-scrolling
        }
    },
    methods: {
        fetchImagesFromFolder() {
            const imageContext = import.meta.glob('/src/assets/img/carousel/*.{png,jpg,jpeg,gif,svg}')

            this.images = Object.values(imageContext).map(path => path.name)

            this.shuffleImages()
        },
        startAutoScroll() {
            this.autoScrollInterval = setInterval(() => {
                if (this.$refs.carousel) {
                    this.$refs.carousel.next()
                }
            }, 3000) // Auto-scroll every 3 seconds
        },
        stopAutoScroll() {
            clearInterval(this.autoScrollInterval)
        },
        shuffleImages() {
            // Shuffle the images array in-place
            for (let i = this.images.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.images[i], this.images[j]] = [this.images[j], this.images[i]]
            }
        }
    },
    mounted() {
        this.fetchImagesFromFolder()
        this.startAutoScroll()
    },
    beforeUnmount() {
        this.stopAutoScroll()
    },
})
</script>
  
<style lang=scss>
$medium: 1500px;
$small: 1050px;

.carousel__wrapper {
    margin: 2rem auto;

    max-width: 1500px;

    overflow-y: visible;
    overflow-x: hidden;

    @media screen and (max-width: $medium) {
        margin: 2rem;
    }
}

.carousel__viewport {
    perspective: 2000px;

    margin: 0 auto;

    touch-action: none !important;
    pointer-events: none;
    user-select: none;
}

.carousel__track {
    transform-style: preserve-3d;
}

.carousel__slide {
    width: 26.76925rem;
    height: 22.5rem;
}

.carousel__item {
    width: 26.76925rem;
    height: 22.5rem;

    flex-shrink: 0;

    -webkit-box-shadow: -4px -4px 20px -18px rgba(0, 0, 0, 0.62);
    -moz-box-shadow: -4px -4px 20px -18px rgba(0, 0, 0, 0.62);
    box-shadow: -4px -4px 20px -18px rgba(0, 0, 0, 0.62);
}

.carousel__slide--sliding {
    transition: 0.5s;
}

.carousel__slide {
    opacity: 0.9;
    transform: rotateY(58deg) scale(0.8);
}

.carousel__slide--active~.carousel__slide {
    opacity: 1;
    transform: rotateY(-58deg) scale(0.8);
}

.carousel__slide--prev {
    opacity: 1;
    transform: rotateY(46deg) scale(0.85);
}

.carousel__slide--next {
    opacity: 1;
    transform: rotateY(-46deg) scale(0.85) !important;
}

.carousel__slide--active {
    opacity: 1;
    transform: rotateY(0) scale(1);
}
</style>