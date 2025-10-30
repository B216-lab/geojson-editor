<template>
  <button :class="[
    'v-button',
    { small, rounded, danger },
    theme,
    { disabled: disabled || isLoading },
  ]" :type="type" @click="$emit('click')">
    <div :class="['button-contents', { hidden: isLoading }]">
      <slot name="iconLeft"></slot>
      <span>{{ text }}
        <slot name="iconRight"></slot>
      </span>
    </div>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset';
  text?: string;
  theme?: string;
  isLoading?: boolean;
  disabled?: boolean;
  small?: boolean;
  iconLeft?: string;
  iconRight?: string;
  rounded?: boolean;
  danger?: boolean;
}>()
defineEmits<{ (e: 'click'): void }>()
</script>

<style lang="scss" scoped>
.v-button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 20px;
  background: var(--color-primary);
  border-radius: 6px;
  border: 0px solid transparent;
  font-weight: bold;
  opacity: 0.8;
  font-family: var(--fontface-title);
  position: relative;
  z-index: 1;
  color: var(--color-secondary);
  font-size: var(--font-size-s);
  // margin: 0 0 5px 0;

  &.small {
    padding: 10px 15px;
  }

  .button-contents {
    display: flex;
    align-items: center;

    span {
      color: var(--color-secondary);
      font-weight: 500;
    }

    &.hidden {
      opacity: 0;
    }
  }

  .floating-dots {
    position: absolute;
    color: var(--color-secondary);
  }

  &.rounded {
    border-radius: 100px;
    padding: 15px 20px;
  }

  &.accent {
    background: var(--color-accent);
  }

  &.accent-2 {
    background: var(--color-accent-2);
  }

  &.light {
    background: var(--color-secondary-light);
    color: var(--font-color);
    opacity: 0.8;

    span {
      color: var(--font-color);
    }
  }

  &.white {
    background: #fff;
    color: var(--color-secondary);
  }

  &.gradient {
    opacity: 1;
    background: var(--color-primary-gradient);
  }

  &.danger {
    opacity: 0.8;
    background: var(--color-error);
  }

  &:hover {
    cursor: pointer;
    opacity: 1;
  }

  &:active {
    opacity: 0.7;
  }

  &.disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
