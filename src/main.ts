import { createApp } from 'vue'

import { createVfm } from 'vue-final-modal'
import Toast, { useToast } from "vue-toastification"

import 'vue-final-modal/style.css'
import "vue-toastification/dist/index.css"
import './style.css'

import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
const vfm = createVfm()

app.use(router)
app.use(store)
app.use(vfm)
app.use(Toast, {
    timeout: 10000,
    maxToasts: 4,
    newestOnTop: true,
    closeButton: false,
    hideProgressBar: true,
    icon: false,
    toastClassName: 'toast',
    bodyClassName: 'toast-body'
})

app.mount('#app')