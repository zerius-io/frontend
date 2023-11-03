// OVERWRITE CONSOLE LOG
const DEV = import.meta.env.DEV

// const originalConsoleLog = console.log
// const originalConsoleError = console.error
// console.log = function (...args) {
//     if (DEV) originalConsoleLog(...args)
// }
// console.error = function (...args) {
//     if (DEV) originalConsoleError(...args)
// }

import { createApp } from 'vue'

import { createVfm } from 'vue-final-modal'
import Toast from "vue-toastification"

import 'vue-final-modal/style.css'
import "vue-toastification/dist/index.css"
import './style.css'

import App from './App.vue'
import router from './router'
import store from './store'

// APP
store.dispatch('config').then(() => {
    const app = createApp(App)
    const vfm = createVfm()

    app.use(router)
    app.use(store)
    app.use(vfm)
    app.use(Toast, {
        timeout: 8000,
        maxToasts: 4,
        newestOnTop: true,
        closeOnClick: false,
        hideProgressBar: true,
        icon: false,
        toastClassName: 'toast',
        bodyClassName: 'toast-body'
    })

    app.mount('#app')
})