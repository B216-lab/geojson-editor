import { createApp } from "vue";
import { router } from "./router";
import { store } from "./store";
import VueClickAway from "vue3-click-away";
import App from "./App.vue";
import "@/styles/global.scss";
import VueLazyLoad from 'vue3-lazyload'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import './registerServiceWorker'

createApp(App)
  .use(router)
  .use(store)
  .use(VueClickAway)
  .use(VueLazyLoad)
  .use(Toast, {})
  .mount("#app");
