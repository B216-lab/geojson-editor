<template>
  <div class="geojson-editor">
    <EditorView />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";
import EditorView from "@/components/studio/Editor/EditorView.vue";
import { useEditorStore } from "@/stores/editor";
import { useUIStore } from "@/stores/ui";

type FeatureCollection = { type: "FeatureCollection"; features: any[] };

const props = defineProps<{
  modelValue: FeatureCollection;
  readOnly?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FeatureCollection): void;
  (e: "change", value: FeatureCollection): void;
  (e: "selection-change", featureIds: string[]): void;
}>();

const editorStore = useEditorStore();
const uiStore = useUIStore();

let isApplyingExternal = false;

const loadFromProp = (fc: FeatureCollection | undefined) => {
  if (!fc || fc.type !== "FeatureCollection") return;
  isApplyingExternal = true;
  editorStore.reset();
  editorStore.addGeoJsonFeatures({
    features: fc.features || [],
    shouldUpdateBBOX: true,
    cascadeStyles: false,
  });
  // maintain readOnly flags
  const ro = !!props.readOnly;
  uiStore.setAccessFlags({ isShapesEditable: !ro, isMapEditable: !ro });
  // release flag after microtask so internal watchers don’t loop
  queueMicrotask(() => {
    isApplyingExternal = false;
  });
};

onMounted(() => {
  loadFromProp(props.modelValue);
  const ro = !!props.readOnly;
  uiStore.setAccessFlags({ isShapesEditable: !ro, isMapEditable: !ro });
});

watch(
  () => props.modelValue,
  (val) => {
    loadFromProp(val);
  },
  { deep: true },
);

watch(
  () => editorStore.getGeoJson,
  (fc) => {
    if (isApplyingExternal) return;
    const value = {
      type: "FeatureCollection",
      features: (fc as any).features || [],
    } as FeatureCollection;
    emit("update:modelValue", value);
    emit("change", value);
  },
  { deep: true },
);

watch(
  () => editorStore.getSelectedFeatureIds,
  (ids) => {
    emit("selection-change", ids as any);
  },
);
</script>

<style scoped>
.geojson-editor {
  width: 100%;
  height: 100%;
}
</style>
