<template>
  <div :class="['container', { small }, { xs }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ small?: boolean; xs?: boolean }>();
</script>

<style lang="scss" scoped>
.container {
  display: block;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;

  &.small {
    max-width: 900px;
  }

  &.xs {
    max-width: 600px;
  }
}
</style>
