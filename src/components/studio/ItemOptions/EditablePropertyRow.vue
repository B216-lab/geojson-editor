<template>
  <div class="editable-wrapper" ref="wrapperRef">
    <form class="editable-property-row" @submit.prevent="updateProperty">
      <input ref="propNameRef" v-model="propName" type="text" placeholder="Name" :class="['prop-name', { disabled }]"
        @blur="updateProperty" tabindex="0" :readonly="disabled" required />
      <input ref="propValueRef" v-model="propValue" type="text" placeholder="Empty"
        :class="['prop-value', { disabled }]" @blur="updateProperty" :readonly="disabled" tabindex="0" required />
      <input v-show="false" type="submit" name="" id="" />
      <button type="button" class="more-button" tabindex="0" @click.stop="openDropDownOptions">
        <Icon icon="mdi:dots-vertical" width="18" height="18" />
      </button>
    </form>
    <div v-if="showEditableOptions" class="editable-options">
      <div class="item" v-for="option in options" :key="option.id" @click="selectAction(option.id)">
        <span>{{ option.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{ name?: string; value?: string | number; disabled?: boolean }>()
const emit = defineEmits<{ (e: 'update', payload: { name: string; value: string | number }): void; (e: 'delete', name: string): void }>()

const propName = ref(props.name || "");
const propNameRef = ref<HTMLInputElement | null>(null);
const propValue = ref(props.value ?? "");
const propValueRef = ref<HTMLInputElement | null>(null);
const showEditableOptions = ref(false);
const wrapperRef = ref<HTMLElement | null>(null);

const editableOptions = computed(() => ({
  copyValue: { id: 'copyValue', name: 'Copy Value' },
  delete: { id: 'delete', name: 'Delete', hide: !!props.disabled },
}))
const options = computed(() => Object.values(editableOptions.value).filter((item: any) => !item.hide))

watch(() => [props.name, props.value], () => {
  propName.value = props.name || ''
  propValue.value = props.value ?? ''
})

const openDropDownOptions = () => { showEditableOptions.value = !showEditableOptions.value }
const copyValue = () => { navigator?.clipboard?.writeText(`${props.value ?? ''}`) }
const selectAction = (action: string) => {
  switch (action) {
    case editableOptions.value.delete.id:
      emit('delete', props.name || '')
      break
    case editableOptions.value.copyValue.id:
      copyValue()
      break
  }
  showEditableOptions.value = false
}
const updateProperty = () => { emit('update', { name: propName.value, value: propValue.value }) }

const onDocumentMouseDown = (event: MouseEvent) => {
  const el = wrapperRef.value as HTMLElement | null;
  if (el && !el.contains(event.target as Node)) {
    showEditableOptions.value = false;
  }
};
onMounted(() => {
  document.addEventListener('mousedown', onDocumentMouseDown);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown);
});

</script>

<style lang="scss" scoped>
.editable-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;

  .editable-options {
    display: flex;
    flex-direction: column;
    max-height: 300px;
    overflow: auto;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
    background: var(--color-secondary);
    position: absolute;
    top: 35px;
    right: 0;
    width: 100px;
    z-index: 9;

    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px;
      border-radius: 3px;

      span {
        margin-left: 10px;
        flex: 1;
      }

      &:hover {
        cursor: pointer;
        background: var(--color-secondary-light);
      }
    }
  }
}

.editable-property-row {
  display: grid;
  flex-direction: row;
  align-items: center;
  grid-template-columns: 1fr 1fr auto;
  padding: 5px 0;

  input {
    height: 20px;
    outline: none;
    border: 0;
    padding: 3px 2px;
    size: 2;
    min-width: 0;
    background: var(--color-secondary);
    border: 2px solid transparent;
    flex: 1;

    &:focus {
      border: 2px solid var(--color-primary);
    }

    &.prop-name {
      margin-right: 10px;
    }

    &.disabled {
      pointer-events: none;
    }
  }

  .more-button {
    border: 0;
    padding: 5px;
    margin: 0;
    background: transparent;
    border-radius: 5px;
    display: flex;

    &:hover {
      cursor: pointer;
      background: var(--color-secondary-light);
    }
  }
}
</style>
