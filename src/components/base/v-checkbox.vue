<template>
  <div class="v-checkbox" @click="$emit('update:modelValue', !modelValue)">
    <Icon :icon="modelValue ? 'mdi:checkbox-marked-outline' : 'mdi:checkbox-blank-outline'" :width="size"
      :height="size" />
    <span class="checkbox-label" v-if="label">{{ label }}</span>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    size: {
      type: [String, Number],
      default: "18",
    },
  },
  emits: {
    'update:modelValue': {
      type: Boolean
    }
  },
  components: {
    Icon,
  },
};
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
