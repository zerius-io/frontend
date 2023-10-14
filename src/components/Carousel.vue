<template>
    <div class="carousel__wrapper">
        <Carousel :itemsToShow="5" :wrapAround="true" :transition="500" :disable-user-scroll="true" ref="carouselRef"
            snapAlign="center" :breakpoints="{
                // 600: { itemsToShow: 1 },
                // 900: { itemsToShow: 4 },
                // 1200: { itemsToShow: 3 },
                // 1100: { itemsToShow: 4 },
                1430: { itemsToShow: 5 }
            }">
            <Slide v-for="(image, index) in images" :key="index">
                <img :src="image" alt="nft" class="carousel__item" />
            </Slide>
        </Carousel>
    </div>
</template>

<script lang="js">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const carouselImages = [
    '6.png',
    '10.png',
    '12.png',
    '13.png',
    '16.png',
    '21.png',
    '23.png',
    '29.png',
    '37.png',
    '45.png',
    '58.png',
    '60.png',
    '75.png',
    '94.png',
    '115.png',
    '122.png',
    '123.png',
    '138.png',
    '207.png',
    '265.png'
]

export default {
    name: 'AutoPlayCarousel',
    components: {
        Carousel,
        Slide
    },
    setup() {
        const images = ref([])
        const carouselRef = ref(null)
        let autoScrollInterval = null

        const fetchImagesFromFolder = () => {
            // const imageContext = import.meta.glob('@/assets/img/carousel/*.{png,jpg,jpeg,gif,svg}')
            // images.value = Object.values(imageContext).map(path => path.name)
            images.value = carouselImages.map(name => `/img/carousel/${name}`)
            shuffleImages()
        }

        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                if (carouselRef.value) {
                    carouselRef.value.next()
                }
            }, 3000)
        }

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval)
        }

        const shuffleImages = () => {
            for (let i = images.value.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [images.value[i], images.value[j]] = [images.value[j], images.value[i]]
            }
        }

        onMounted(() => {
            fetchImagesFromFolder()
            startAutoScroll()
        })

        onBeforeUnmount(() => {
            stopAutoScroll()
        })

        return {
            images,
            carouselRef,
            fetchImagesFromFolder,
            startAutoScroll,
            stopAutoScroll,
            shuffleImages
        }
    }
}
</script>

<style lang=scss>
$small: 1100px;
$medium: 1500px;

.carousel__wrapper {
    margin: 2rem auto;

    max-width: 1500px;
    overflow-y: visible;
    overflow-x: hidden;

    @media screen and (max-width: $small) {
        margin: 1rem;
    }

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

.carousel__slide,
.carousel__item {
    width: 22.5rem;
    height: 22.5rem;

    border-radius: 0.68rem;

    @media screen and (max-width: 1200px) {
        width: 16.5rem;
        height: 16.5rem;
    }

    @media screen and (max-width: 900px) {
        width: 12.5rem;
        height: 12.5rem;
    }

    @media screen and (max-width: 550px) {
        width: 10.5rem;
        height: 10.5rem;
    }

    @media screen and (max-width: 500px) {
        width: 8.5rem;
        height: 8.5rem;
    }

    @media screen and (max-width: 400px) {
        width: 6.5rem;
        height: 6.5rem;
    }

    @media screen and (max-width: 320px) {
        width: 4.5rem;
        height: 4.5rem;
    }
}

.carousel__item {
    flex-shrink: 0;
    -webkit-box-shadow: -4px -4px 20px -18px rgba(0, 0, 0, 0.62);
    -moz-box-shadow: -4px -4px 20px -18px rgba(0, 0, 0, 0.62);
    box-shadow: -4px -4px 20px -18px rgba(0, 0, 0, 0.62);
}

.carousel__slide--sliding {
    transition: 0.5s;
}

$degreeFront: 36deg;
$degreeBack: 46deg;

.carousel__slide {
    opacity: 1;
    transform: rotateY($degreeBack) scale(0.8);
}

.carousel__slide--active~.carousel__slide {
    opacity: 1;
    transform: rotateY(-$degreeBack) scale(0.8);
}

.carousel__slide--prev {
    opacity: 1;
    transform: rotateY($degreeFront) scale(0.85);
}

.carousel__slide--next {
    opacity: 1;
    transform: rotateY(-$degreeFront) scale(0.85) !important;
}

.carousel__slide--active {
    opacity: 1;
    transform: rotateY(0) scale(1);
}
</style>