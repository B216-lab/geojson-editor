<template>
  <div class="editor-view">
    <map-view @onClick="onClickMap" @onDragStart="() => setIsDragging(true)" @onDragEnd="() => setIsDragging(false)"
      :layers="layers" :cursor="activeTool?.cursor" />
    <GeoPopup v-if="popupData && !contextData && !isDragging" :x="popupData?.x" :y="popupData?.y"
      :feature="popupData?.feature" :showProperties="showProperties" />
    <ContextMeu v-if="contextData && !isDragging" :x="contextData?.x" :y="contextData?.y"
      :latitude="contextData?.latitude" :longitude="contextData?.longitude" :feature="contextData?.feature"
      @close="contextData = null" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import MapView from "./MapView.vue";
import GeoPopup from "./GeoPopup.vue";
import ContextMeu from "./ContextMenu.vue";
import { EditableGeoJsonLayer } from "@deck.gl-community/editable-layers";
import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import { useEditorStore, EDITING_MODE, MAP_TOOLS } from "@/stores/editor";
import { useMapStore } from "@/stores/map";
import { useUIStore } from "@/stores/ui";
import { DISTANCE_SCALE } from "@/utils/constants";

const editorStore = useEditorStore();
const mapStore = useMapStore();
const uiStore = useUIStore();
const accessFlags = computed(() => uiStore.getAccessFlags);
const geojson = computed(() => editorStore.getGeoJson);
const activeTool = computed(() => MAP_TOOLS[editorStore.getActiveTool]);
const activeMode = computed(() => MAP_TOOLS[editorStore.getActiveTool].mode);
const hoveredFeatureId = computed(() => editorStore.getHoveredFeatureId);
const selectedFeatures = computed(() => editorStore.getSelectedFeatures);
const showProperties = computed(() => mapStore.getShowPropertiesPopup);
const getUseExactDimensions = computed(() => mapStore.getUseExactDimensions);
const temporaryMapMarker = computed(() => mapStore.getTemporarySearchMarkerLocation);
const activeEditMode = computed(() => editorStore.getActiveEditMode && EDITING_MODE[editorStore.getActiveEditMode]?.mode);

const isDragging = ref(false);
const setIsDragging = (value) => { isDragging.value = value; };

const tempGeoJson = ref({ type: "FeatureCollection", features: [] });
const setGeoJson = (updatedData) => {
  console.log(`setting geojson`);
  editorStore.addGeoJsonFeatures({ features: updatedData.features });
  editorStore.setActiveTool(MAP_TOOLS.select.id);
};
const layers = ref([]);
const popupData = ref(null);
const contextData = ref(null);

const onClickMap = (info, event) => {
  if (info?.index === -1) {
    if (selectedFeatures?.value?.length) {
      editorStore.setActiveEditMode({ mode: null, featureId: null });
    }
    if (activeTool.value.id === MAP_TOOLS.select.id && event.rightButton) {
      const { x, y } = event.offsetCenter;
      const { coordinate } = info;
      contextData.value = { x, y, latitude: coordinate[1], longitude: coordinate[0] };
    } else {
      contextData.value = null;
    }
  }
};

const createLayers = async () => {
  console.log(`Rerendering layers...`);
  const layersToRender = [];
  const geoJsonLayer = new GeoJsonLayer({
    id: "base-geojson-layer",
    data: geojson.value,
    getFillColor: (d) => d.properties.hideFill ? [0, 0, 0, 0] : d.properties.fillColor || [66, 135, 245, 100],
    getLineColor: (d) => d.properties.hideLine ? [0, 0, 0, 0] : d.properties.lineColor || [66, 135, 245],
    getLineWidth: (d) => d.properties.lineWidth * DISTANCE_SCALE[d.properties.widthScale].scale,
    lineWidthScale: 1,
    lineWidthMinPixels: getUseExactDimensions.value ? 0 : 2,
    getPointRadius: (d) => d.properties.pointRadius * DISTANCE_SCALE[d.properties.radiusScale].scale,
    pointRadiusMinPixels: getUseExactDimensions.value ? 0 : 4,
    radiusScale: 1,
    pickable: true,
    autoHighlight: true,
    highlightColor: () => [0, 0, 0, 50],
    onHover: (info, event) => {
      if (info.object) {
        const { x, y } = event.offsetCenter;
        const feature = info.object;
        popupData.value = { x, y, feature };
        if (feature?.properties?.id !== hoveredFeatureId.value) {
          editorStore.setHoveredFeatureId(feature.properties.id);
        }
      } else {
        popupData.value = null;
        editorStore.setHoveredFeatureId(null);
      }
    },
    onClick: (info, event) => {
      if (event.leftButton) {
        contextData.value = null;
      }
      if (activeTool.value.id === "select" && event.leftButton) {
        if (info.object?.properties?.id) {
          const { srcEvent } = event;
          const { ctrlKey, metaKey, shiftKey } = srcEvent;
          if (ctrlKey || metaKey || shiftKey) {
            editorStore.customSelectFeatureId({ featureId: info.object.properties.id, isMultiSelect: false });
          } else {
            editorStore.setActiveEditMode({ mode: null, featureId: info.object.properties.id });
          }
        }
      } else if (activeTool.value.id === "select" && event.rightButton) {
        if (info.object?.properties?.id) {
          const { x, y } = event.offsetCenter;
          const { coordinate, object } = info;
          contextData.value = { x, y, feature: object, latitude: coordinate[1], longitude: coordinate[0] };
        }
      }
    },
  });
  layersToRender.push(geoJsonLayer);

  const editableLayer = new EditableGeoJsonLayer({
    id: "editable-geojson-layer",
    data: tempGeoJson.value,
    mode: activeEditMode.value || activeMode.value,
    pickable: true,
    pickingRadius: 5,
    selectedFeatureIndexes: tempGeoJson.value?.features?.length ? [0] : [],
    getFillColor: (d) => d.properties.hideFill ? [0, 0, 0, 0] : d.properties.fillColor || [66, 135, 245, 100],
    getLineColor: (d) => d.properties.hideLine ? [0, 0, 0, 0] : d.properties.lineColor || [66, 135, 245],
    getLineWidth: (d) => d.properties.lineWidth * DISTANCE_SCALE[d.properties.widthScale].scale,
    lineWidthScale: 0,
    getPointRadius: (d) => d.properties.pointRadius * DISTANCE_SCALE[d.properties.radiusScale].scale,
    editHandlePointOutline: true,
    getEditHandlePointColor: () => [255, 255, 255],
    getEditHandlePointOutlineColor: () => [66, 135, 245],
    onEdit: ({ editType, updatedData }) => {
      const updatableEditTypes = ["rotated", "scaled", "finishMovePosition", "translated"];
      if (editType === "addFeature") {
        setGeoJson(updatedData);
        return;
      } else if (updatableEditTypes.indexOf(editType) !== -1) {
        editorStore.updateFeatureProperties({
          featureId: updatedData?.features[0]?.properties?.id,
          geometry: updatedData?.features[0]?.geometry,
          shouldSync: true,
        });
      } else {
        tempGeoJson.value = updatedData;
      }
    },
    _subLayerProps: { tooltips: { getSize: 12, offset: 10 } },
  });
  layersToRender.push(editableLayer);

  if (temporaryMapMarker.value) {
    const SVG_ICON = `
        <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 0 24 24" width="48px" fill="#0060FF"><path d="M0 0h24v24H0z" fill="none"/><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
        `;
    const iconLayer = new IconLayer({
      id: `temporary_map_marker`,
      data: [temporaryMapMarker.value],
      pickable: false,
      getIcon: () => ({
        url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(SVG_ICON)}`,
        width: 100,
        height: 100,
      }),
      sizeScale: 5,
      getPosition: (d) => d,
      getSize: () => 10,
      getColor: () => [255, 0, 0],
      transitions: { getSize: 300 },
    });
    layersToRender.push(iconLayer);
  }
  layers.value = layersToRender;
};

const setupShortCuts = (event) => {
  if (document.activeElement.tagName.toLowerCase() !== "input") {
    if (accessFlags.value.isShapesEditable) {
      switch (event.key) {
        case "v": editorStore.setActiveTool(MAP_TOOLS.select.id); break;
        case "p": editorStore.setActiveTool(MAP_TOOLS.polygon.id); break;
        case "r": editorStore.setActiveTool(MAP_TOOLS.rectangle.id); break;
        case "e": editorStore.setActiveTool(MAP_TOOLS.ellipse.id); break;
        case "l": editorStore.setActiveTool(MAP_TOOLS.line.id); break;
        case "o": editorStore.setActiveTool(MAP_TOOLS.point.id); break;
        case "m": editorStore.setActiveTool(MAP_TOOLS.measure.id); break;
        case "s": uiStore.setShowMapSearch(true); break;
        case "D": mapStore.setUseExactDimensions(!mapStore.getUseExactDimensions); break;
        case "L": mapStore.setShowMapLabels(!mapStore.getShowMapLabels); break;
        case "Z": editorStore.updateBoundingBox(); break;
      }
    } else {
      switch (event.key) {
        case "s": uiStore.setShowMapSearch(true); break;
        case "D": mapStore.setUseExactDimensions(!mapStore.getUseExactDimensions); break;
        case "L": mapStore.setShowMapLabels(!mapStore.getShowMapLabels); break;
        case "Z": editorStore.updateBoundingBox(); break;
      }
    }
  }
};

const setupMetaKeys = (event) => {
  if (document.activeElement.tagName.toLowerCase() !== "input" && accessFlags.value.isShapesEditable) {
    switch (event.key) {
      case "Escape":
        editorStore.setActiveTool(MAP_TOOLS.select.id);
        break;
      case "Backspace":
      case "Delete":
        if (selectedFeatures?.value?.length) {
          editorStore.deleteSelectedFeatures();
        }
        event.preventDefault();
        break;
      case "a":
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          editorStore.selectAllFeatures();
        }
        break;
    }
  }
};

watch(geojson, () => { createLayers(); });
watch(activeTool, () => { createLayers(); });
watch(activeEditMode, (value) => {
  tempGeoJson.value = { type: "FeatureCollection", features: value && activeEditMode.value ? selectedFeatures.value : [] };
  createLayers();
});
watch(tempGeoJson, () => { createLayers(); });
watch(temporaryMapMarker, () => createLayers());
watch(getUseExactDimensions, () => { createLayers(); });

onMounted(() => {
  createLayers();
  document.addEventListener("keypress", setupShortCuts);
  document.addEventListener("keydown", setupMetaKeys);
});

onBeforeUnmount(() => {
  document.removeEventListener("keypress", setupShortCuts);
  document.removeEventListener("keydown", setupMetaKeys);
});
</script>

<style lang="scss" scoped>
.map-view,
.editor-view {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
