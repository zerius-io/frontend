<template>
  <Header />

  <div style="flex: 1">
    <router-view />
  </div>

  <Footer />
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>

<style lang="scss">
$medium: 1500px;
$small: 700px;

@font-face {
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 400;
  src: local('Space Grotesk Regular'), local('SpaceGrotesk-Regular'),
    url('/fonts/SpaceGrotesk-Regular.ttf') format('truetype');
}

@font-face {
  font-family: 'Space Grotesk';
  font-style: bold;
  font-weight: 700;
  src: local('Space Grotesk Bold'), local('SpaceGrotesk-Bold'),
    url('/fonts/SpaceGrotesk-Bold.ttf') format('truetype');
}

body {
  margin: 0;
  padding: 0;

  font-family: 'Space Grotesk', sans-serif;

  text-align: center;
  color: #2c3e50;

  background: rgb(249, 237, 234);
  background: linear-gradient(90deg, rgba(249, 237, 234, 1) 3%, rgba(255, 238, 238, 1) 66%, rgba(248, 242, 211, 1) 96%), url('/img/bg.png');

  &::-webkit-scrollbar {
    position: fixed;
    width: 5px;
  }

  &::-webkit-scrollbar-track {}

  &::-webkit-scrollbar-thumb {
    background: rgba(179, 179, 179, 0.9);
    border-radius: .85rem;
  }
}

body::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/img/bg.png');
  opacity: 1;
  z-index: -1;
}

#app {
  display: flex;
  flex-direction: column;

  margin: 0 auto;

  max-width: 90rem;
  min-height: 100vh;
}

h1 {
  margin: 2.6rem auto;

  color: var(--dark, #080808);
  text-align: center;
  font-size: 2.25rem;
  font-style: bold;
  font-weight: 500;
  line-height: 120%;
}

a {
  all: unset;
  cursor: pointer;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

// For Starknet connection
.backdrop-blur-sm {
  display: none !important;
}

button,
.icon {
  transition: transform 0.2s ease-out;

  &:not(:disabled):hover {
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }

  &:disabled {
    color: #fff;
    background: var(--gray, #A1A1A9);

    &:hover {
      transform: none;
    }
  }
}


button,
select,
.custom-select {
  width: 11.1875rem;

  text-align: center;

  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 120%;

  color: var(--blue, #2C6EFF);
  cursor: pointer;

  border-radius: 0.75rem;
  border: 1px solid var(--blue, #2C6EFF);
  background: rgba(255, 255, 255, 0.50);
  box-shadow: 0px 0px 8px 0px rgba(205, 218, 252, 0.20);
  backdrop-filter: blur(3px);
}

button {
  &:disabled {
    cursor: default;

    text-transform: capitalize;
    letter-spacing: 0.1rem;

    border: none;
    box-shadow: none;
  }
}

select,
option,
.custom-select,
.custom-select .items {
  text-transform: capitalize;
}

.button {
  color: var(--blue, #2C6EFF);

  border: 1px solid var(--blue, #2C6EFF);
  background: rgba(255, 255, 255, 0.50);
  box-shadow: 0px 0px 8px 0px rgba(205, 218, 252, 0.20);

  &__full {
    color: #fff;

    border-radius: 0.75rem;
    background: var(--blue, #2C6EFF);
    box-shadow: 0px 0px 16px 0px rgba(44, 110, 255, 0.50);

    &-uppercase {
      color: #fff;

      border-radius: 0.75rem;
      background: var(--blue, #2C6EFF);
      box-shadow: 0px 0px 16px 0px rgba(44, 110, 255, 0.50);

      text-transform: uppercase;
      letter-spacing: 0.45rem;
    }

    &-starknet {
      background: var(--blue, #762cff);
      box-shadow: 0px 0px 16px 0px #762cff67;
    }
  }

  &__shadow {
    color: black;
    font-weight: 500;

    border: unset;
    box-shadow: 0px 0px 16px 0px rgba(105, 105, 105, 0.3);
  }
}

select {
  background: rgba(255, 255, 255, 0.50);

  :disabled {
    pointer-events: none;
    opacity: 0.6;
  }
}

.select {
  margin-left: 1.15rem;
  margin-right: 1.15rem;
}

.router-link {
  &-active {
    font-weight: bold;
    color: #2C6EFF;

  }
}

.soon-tip {
  position: absolute;
  top: 10px;
  right: -47px;
  color: white;

  display: flex;
  padding: 0rem 0.375rem 0.125rem 0.375rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  font-size: 12px;
  border-radius: 0.55rem 0.2rem;
  background: var(--blue, #2C6EFF);
}

.new-tip {
  position: inherit;
  display: inline-block;

  top: -8px;
  right: -7px;

  line-height: 1rem;

  @extend .soon-tip;
  background: var(--red, #FF2C6E);
}

@media screen and (max-width: $small) {

  button,
  .select,
  .select__selected {
    width: 8rem;
    height: 2rem;

    font-size: 0.6875rem;

    -webkit-tap-highlight-color: transparent;
  }

  .select {
    margin-left: auto;
    margin-right: auto;

    padding: 0.375rem 0.5rem;

    height: 1.2rem;
  }

  .select__selected {
    height: 1.15rem;
  }

  .select__items {
    width: 9rem;

    top: 33px;
    right: 4px;

  }

  button {
    font-size: .8rem;
    border-radius: 0.25rem;
  }

}
</style>
