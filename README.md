# GeoJSON editor

<p align="center">
  <a href="https://vitejs.dev/">
    <img alt="Vite" src="https://img.shields.io/badge/vite-7.1.7-blue.svg?logo=vite&logoColor=white" />
  </a>
  <a href="https://vuejs.org/">
    <img alt="Vue" src="https://img.shields.io/badge/vue-3.5.22-brightgreen.svg?logo=vue.js&logoColor=white" />
  </a>
  <a href="https://vuejs.org/guide/extras/composition-api-faq.html">
    <img alt="Composition API" src="https://img.shields.io/badge/Composition%20API-blueviolet?logo=vue.js&logoColor=white" />
  </a>
  <a href="#">
    <img alt="Locales: en, ru" src="https://img.shields.io/badge/locales-en%2Cru-blueviolet" />
  </a>
  <a href="https://www.gnu.org/licenses/gpl-3.0">
    <img alt="License: GPL v3" src="https://img.shields.io/badge/license-GPLv3-blue.svg" />
  </a>
</p>

## Use as a library

```bash
pnpm build:lib
```

```bash
export VITE_APP_MAPBOX_TOKEN=your_mapbox_token
```

```vue
<template>
  <GeoJsonEditor
    v-model="fc"
    :read-only="false"
    @change="onChange"
    @selection-change="onSelect"
  />
</template>

<script setup lang="ts">
import { createPinia } from "pinia";
import { createApp, ref } from "vue";
// If installed from a package: import { GeoJsonEditor } from 'geojson-editor'
// Local file import example:
import { GeoJsonEditor } from "./dist/geojson-editor.es.js";
import "mapbox-gl/dist/mapbox-gl.css";

const fc = ref({ type: "FeatureCollection", features: [] as any[] });
const onChange = (value: any) => {
  /* persist or react to updated features */
};
const onSelect = (ids: string[]) => {
  /* selection ids changed */
};

// In main.ts of the consumer app ensure Pinia is installed
// const app = createApp(App)
// app.use(createPinia())
// app.mount('#app')
</script>
```

### Props

- `modelValue: FeatureCollection` – initial and controlled value (v-model)
- `readOnly?: boolean` – disables editing when true

### Emits

- `update:modelValue` – new FeatureCollection (for v-model)
- `change` – same payload as above for side-effects
- `selection-change` – `string[]` of selected feature ids

# Worth noticing

- To interactively edit geometry features the project uses `@deck.gl-community/editable-layers` that can be behind official `deck.gl` due to possible lack of maintenance, so keep eye on versions of both
