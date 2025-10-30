<template>
  <div class="context-menu" :style="{
    top: `${y + 10}px`,
    left: `${x + 10}px`,
  }">
    <div class="options">
      <div class="option" v-for="item in options" :key="item.id" @click="selectOption(item.id)">
        <Icon :icon="item.icon" width="18" height="18" class="icon" />
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { useEditorStore } from "@/stores/editor";

defineProps({
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
  features: {
    type: Array,
  },
});

const emit = defineEmits(["close"]);

const options = [
  {
    id: "delete",
    icon: "mdi:trash-can-outline",
    name: "Delete",
  },
];

const editorStore = useEditorStore();
const selectOption = (itemId) => {
  switch (itemId) {
    case "delete":
      editorStore.deleteSelectedFeatures();
      break;
  }
  emit("close");
};
</script>

<style lang="scss" scoped>
.context-menu {
  width: 200px;
  background: var(--color-secondary);
  position: absolute;
  z-index: 99;
  border-radius: 2px;
  border: 1px solid var(--color-secondary-light);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);

  .options {
    display: flex;
    flex-direction: column;

    .option {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px;

      .icon {
        margin-right: 10px;
      }

      &:hover {
        background: var(--color-secondary-light);
        cursor: pointer;
      }
    }
  }
}
</style>
