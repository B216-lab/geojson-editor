import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'GeoJsonEditor',
      fileName: (format) => `geojson-editor.${format}.js`,
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        'vue',
        'pinia',
        'mapbox-gl',
        '@deck.gl/core',
        '@deck.gl/layers',
        '@deck.gl-community/editable-layers'
      ],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})


