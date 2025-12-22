import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import axios from 'axios'
import { useAuthStore } from "./store/index";

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

const authStore = useAuthStore();
authStore.initAuth();

app.mount('#app')
