import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { AxiosKey } from '@/symbols'
import router from './router'
import Toast from 'vue-toastification'
import http from '@/http'
import auth from '@/auth'

import 'vue-toastification/dist/index.css'
const toastOptions = {}

const app = createApp(App)
app.use(createPinia())
app.provide(AxiosKey, http)
app.use(Toast, toastOptions)
app.use(router)
app.use(auth)
app.mount('#app')
