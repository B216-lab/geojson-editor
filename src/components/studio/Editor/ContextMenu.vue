<template>
  <div class="context-menu" ref="rootRef" :style="{
    top: `${y + 10}px`,
    left: `${x + 10}px`,
  }">
    <div v-if="feature" class="header">
      <div class="icon">
        <Icon :icon="iconForShape(feature.geometry.type)" width="18" height="18" />
      </div>
      <h4>{{ feature.properties.name }}</h4>
    </div>
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
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { toast } from "vue-sonner";
import { useUIStore } from "@/stores/ui";
import { useMapStore } from "@/stores/map";
import { useEditorStore, EDITING_MODE } from "@/stores/editor";
import { FEATURE_TYPES } from "@/models/Feature.model";

const props = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  feature: { type: Object },
});
const emit = defineEmits(["close"]);

const iconForShape = (type) => {
  switch (type) {
    case FEATURE_TYPES.Polygon:
    case FEATURE_TYPES.MultiPolygon:
      return "mdi:shape-outline";
    case FEATURE_TYPES.LineString:
    case FEATURE_TYPES.MultiLineString:
      return "mdi:vector-line";
    case FEATURE_TYPES.Point:
      return "mdi:map-marker-outline";
    default:
      return "mdi:shape-outline";
  }
};

const uiStore = useUIStore();
const mapStore = useMapStore();
const editorStore = useEditorStore();
const accessFlags = computed(() => uiStore.getAccessFlags);
const options = computed(() => [
  ...(props.feature && accessFlags.value.isShapesEditable
    ? [
      ...(props.feature.geometry.type !== FEATURE_TYPES.Point
        ? [
          { id: "modify", icon: "mdi:vector-polyline-edit", name: "Modify" },
          { id: "transform", icon: "mdi:axis-arrow", name: "Transform" },
        ]
        : []),
      { id: "delete", icon: "mdi:trash-can-outline", name: "Delete" },
    ]
    : []),
  ...(props.latitude && props.longitude
    ? [
      { id: "copycords", icon: "mdi:content-copy", name: "Copy Coordinates" },
      {
        id: "openIn2gis",
        icon: "lets-icons:map-fill",
        name: "Open in 2GIS",
        link: `https://2gis.ru/map/${props.latitude},${props.longitude}`,
      },
    ]
    : []),
]);

const copyCoordinates = async () => {
  try {
    await navigator?.clipboard?.writeText(`${props.latitude}, ${props.longitude}`);
    toast.success("Coordinates copied", { description: `${props.latitude}, ${props.longitude}` });
  } catch (e) {
    toast.error("Failed to copy coordinates");
  }
};

const openIn2gis = () => {
  const zoom = 14;
  const lon = props.longitude;
  const lat = props.latitude;
  const coordParam = `${lon}%2C${lat}`;
  const url = `https://2gis.ru/irkutsk/geo/70030076318974799/${coordParam}?m=${coordParam}%2F${zoom}`;
  window.open(url, '_blank');
  return;
};

const selectOption = (itemId) => {
  switch (itemId) {
    case "modify":
      editorStore.setActiveEditMode({
        featureId: props.feature?.properties?.id,
        mode: EDITING_MODE.modify.id,
      });
      break;
    case "transform":
      editorStore.setActiveEditMode({
        featureId: props.feature?.properties?.id,
        mode: EDITING_MODE.transform.id,
      });
      break;
    case "delete":
      editorStore.deleteFeatureById({
        featureId: props.feature?.properties?.id,
      });
      break;
    case "searchArea":
      mapStore.setSearchLocation([props.latitude, props.longitude]);
      uiStore.setShowMapSearch(true);
      break;
    case "copycords":
      copyCoordinates();
      break;
    case "openIn2gis":
      openIn2gis();
      break;
  }
  emit("close");
};

const rootRef = ref(null);
const onDocumentMouseDown = (event) => {
  const el = rootRef.value;
  if (el && !(el.contains && el.contains(event.target))) {
    emit("close");
  }
};
onMounted(() => {
  setTimeout(() => document.addEventListener('mousedown', onDocumentMouseDown), 0);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMouseDown);
});
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

  .header {
    padding: 10px;
    border-bottom: 1px solid var(--color-secondary-light);
    display: flex;
    align-items: center;

    .icon {
      background: var(--color-primary-light);
      color: var(--color-primary);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      margin-right: 5px;
    }

    h4 {
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

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
