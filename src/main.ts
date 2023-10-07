import { createApp } from 'vue'
import Toast, { POSITION } from "vue-toastification"

import App from './App.vue'
import router from './router'

import "vue-toastification/dist/index.css"
import './style.css'

const app = createApp(App)

app.use(router)
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000
})
app.mount('#app')
