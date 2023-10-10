import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import { createVfm } from 'vue-final-modal'
import Toast from "vue-toastification"

import 'vue-final-modal/style.css'
import "vue-toastification/dist/index.css"
import './style.css'

const app = createApp(App)
const vfm = createVfm()

app.use(router)
app.use(store)
app.use(vfm)
app.use(Toast, { timeout: 3000 })

app.mount('#app')
