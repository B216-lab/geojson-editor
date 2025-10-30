<template>
  <div class="v-checkbox" @click="$emit('update:modelValue', !modelValue)">
    <Icon :icon="modelValue ? 'mdi:checkbox-marked-outline' : 'mdi:checkbox-blank-outline'" :width="size"
      :height="size" />
    <span class="checkbox-label" v-if="label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";

defineProps<{
  modelValue?: boolean;
  label?: string;
  size?: string | number;
}>()
defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
</script>

<style lang="scss" scoped>
.v-checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;

  .checkbox-label {
    margin-left: 5px;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>
