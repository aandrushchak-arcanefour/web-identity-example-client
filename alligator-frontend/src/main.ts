import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import AuthPlugin from './plugins/AuthPlugin'
import { watch } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.config.globalProperties.$store = useAuthStore()

app.use(AuthPlugin)

app.mount('#app')
