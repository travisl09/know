import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

let app = createApp(App)
app.config.globalProperties.window = window
app.config.globalProperties.document = document
app.mount('#app')


