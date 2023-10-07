<template>
    <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<style lang="scss">
$size: 1.8rem;
$ring-size: 1.6rem;

.lds-ring {
    display: inline-block;
    position: relative;
    // width: $size;
    // height: $size;
}

.lds-ring div {
    box-sizing: border-box;
    display: block;

    position: absolute;
    top: -27px;
    right: -33px;

    margin: 8px;

    width: $ring-size;
    height: $ring-size;

    border: 4px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
}

.lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
}

.lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
}

@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>