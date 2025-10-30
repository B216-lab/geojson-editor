<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import MapStudio from '@/pages/MapStudio.vue'
import 'vue-sonner/style.css'
</script>

<template>
  <MapStudio />
  <Toaster position="bottom-center" rich-colors :style="{ zIndex: 10000 }" />
</template>

<style scoped></style>
