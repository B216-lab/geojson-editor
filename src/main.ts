import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import "@/styles/global.scss";

// Disable Mapbox telemetry to prevent events.mapbox.com calls (CORS noise in dev)
import * as mapboxgl from 'mapbox-gl'
try { (mapboxgl as any).setTelemetryDisabled?.(true) } catch { }


import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import ru from './locales/ru.json'

type MessageSchemas = typeof en | typeof ru

const i18n = createI18n<[MessageSchemas], 'en-US' | 'ru-RU'>({
    locale: 'ru-RU',
    messages: {
        'en-US': en,
        'ru-RU': ru
    }
})

const pinia = createPinia()
const app = createApp(App)

app.use(i18n)
app.use(pinia)

app.mount('#app')
