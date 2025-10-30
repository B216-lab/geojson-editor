<template>
  <div class="multi-feature-options">
    <div class="header">
      <h4>{{ selectedItemsCount }} items selected</h4>
    </div>
    <div class="scroll-container">
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from "@/stores/editor";
import { computed } from "vue";
import VSection from "@/components/base/v-section.vue";
const debounce = (fn: Function, delay = 300) => {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

const editorStore = useEditorStore();
const selectedItemsCount = computed(() => editorStore.getSelectedFeatureIds?.length);
// groupedProperties is not used in template; kept for potential future use
const groupedProperties = computed(() => (editorStore as any).getGroupedPropertiesFromSelected);

const debouncedFeatureSync = debounce((featureIds: string[]) => {
  // No-op sync in modern setup; backend sync can be integrated here if needed
}, 500);

const updateFillColor = (property: any, color: any) => {
  if (JSON.stringify(property.value) !== JSON.stringify(color)) {
    EditorStore.actions.updateMultipleFeatureProperties({
      featureIds: property.featureIds,
      properties: { fillColor: color },
      shouldSync: false,
    });
    debouncedFeatureSync(property.featureIds);
  }
};

const updateLineColor = (property: any, color: any) => {
  if (JSON.stringify(property.value) !== JSON.stringify(color)) {
    EditorStore.actions.updateMultipleFeatureProperties({
      featureIds: property.featureIds,
      properties: { lineColor: color },
      shouldSync: false,
    });
    debouncedFeatureSync(property.featureIds);
  }
};
</script>

<style lang="scss" scoped>
.multi-feature-options {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .header {
    padding: 10px;
    border-bottom: 1px solid var(--color-secondary-light);
    display: flex;
    align-items: center;

    h4 {
      font-weight: bold;
    }
  }

  .scroll-container {
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .color-picker-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    column-gap: 2px;
    row-gap: 2px;
  }
}
</style>
