import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
// Disable Mapbox telemetry to prevent events.mapbox.com calls (CORS noise in dev)
import * as mapboxgl from 'mapbox-gl'
try { (mapboxgl as any).setTelemetryDisabled?.(true) } catch { }

import "@/styles/global.scss";
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
