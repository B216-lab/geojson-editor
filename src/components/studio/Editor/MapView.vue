<template>
  <div id="editor-map-view" class="deck-container" ref="deckContainerRef">
    <v-deckgl :layers="layers" :viewState="viewState" :disableContextMenu="true" :cursor="cursor" :controller="{
      doubleClickZoom: false,
    }" @click="(info, event) => $emit('onClick', info, event)" @drag="(info, event) => $emit('onDrag', info, event)"
      @onDragStart="(info, event) => $emit('onDragStart', info, event)"
      @onDragEnd="(info, event) => $emit('onDragEnd', info, event)"
      @view-state-change="(viewState) => updateViewState(viewState)">
      <!-- Base map -->
      <template v-slot:background>
        <div id="base-map" ref="map"></div>
      </template>
      <!-- Map Labels -->
      <template v-slot:foreground>
        <div id="foreground-map" ref="fgmap" v-show="showMapLabels"></div>
      </template>
    </v-deckgl>
  </div>
  <MapControls @onClickSearch="setShowMapSearch(true)" @onClickZoomIn="zoomIn" @onClickZoomOut="zoomOut"
    @onClickFitScreen="fitScreen" />
</template>

<script setup>
import { Map } from "mapbox-gl";
import VDeckgl from "@/components/base/v-deckgl.vue";
import { computed, onMounted, watch, ref, nextTick } from "vue";
import { useMapStore } from "@/stores/map";
import { useEditorStore } from "@/stores/editor";
import { useUIStore } from "@/stores/ui";
import { WebMercatorViewport, MapController } from "@deck.gl/core";
import Feature, { FEATURE_TYPES } from "@/models/Feature.model";
import MapControls from "./MapControls.vue";
import "mapbox-gl/dist/mapbox-gl.css";
import { FlyToInterpolator } from "@deck.gl/core";

const props = defineProps({
  layers: { type: Array, default: () => [] },
  cursor: { type: String, default: "default" },
});
defineEmits(["onClick", "onDrag", "onDragStart", "onDragEnd"]);

const mapStore = useMapStore();
const editorStore = useEditorStore();
const uiStore = useUIStore();
const ACCESS_TOKEN = import.meta.env.VITE_APP_MAPBOX_TOKEN;
const activeMapStyleURL = computed(() => mapStore.getActiveMapStyleURL);
const showMapLabels = computed(() => mapStore.getShowMapLabels);
const focusedFeature = computed(() => editorStore.getFocusedFeature);
const boundingBox = computed(() => editorStore.getBoundingBox);
const setShowMapSearch = uiStore.setShowMapSearch;
const deckContainerRef = ref(null);
const map = ref(null);
const fgmap = ref(null);
const viewState = ref({ latitude: 52.267329, longitude: 104.321593, zoom: 14, bearing: 0, pitch: 0 });
let baseMap = null;
let foregroundMap = null;

onMounted(async () => {
  await nextTick();
  baseMap = new Map({
    accessToken: ACCESS_TOKEN,
    container: map.value,
    interactive: false,
    language: 'ru',
    style: activeMapStyleURL.value,
    center: [viewState.value.longitude, viewState.value.latitude],
    zoom: viewState.value.zoom,
    pitch: viewState.value.pitch,
    bearing: viewState.value.bearing,
    preserveDrawingBuffer: true,
  });

  baseMap.on("style.load", () => {
    baseMap.style.stylesheet.layers.forEach((layer) => {
      if (layer.type === "symbol") {
        baseMap.removeLayer(layer.id);
      }
    });
  });

  foregroundMap = new Map({
    accessToken: ACCESS_TOKEN,
    container: fgmap.value,
    interactive: false,
    style: "mapbox://styles/haxzie/ckcd6vxu30fe01iqk51qaplby",
    center: [viewState.value.longitude, viewState.value.latitude],
    zoom: viewState.value.zoom,
    pitch: viewState.value.pitch,
    bearing: viewState.value.bearing,
    preserveDrawingBuffer: true,
  });

  foregroundMap.on("style.load", () => {
    if (boundingBox.value) {
      console.log(`Bounding box`)
      updateViewStateWithBoundingBox(boundingBox.value);
    }
  })
});

watch(focusedFeature, (feature) => {
  if (feature) {
    console.log(feature);
    const { width, height } = deckContainerRef.value.getBoundingClientRect();
    const vs = new WebMercatorViewport({ ...viewState.value, width, height });

    try {
      const box = feature.bbox || (new Feature(feature).bbox);
      const boundedViewState = vs.fitBounds([[box[0], box[1]], [box[2], box[3]]]);
      let { latitude, longitude, zoom, bearing, pitch } = boundedViewState;
      zoom = feature.geometry.type === FEATURE_TYPES.Point ? zoom - 4 : zoom;
      updateViewState({
        latitude,
        longitude,
        zoom,
        bearing,
        pitch,
        transitionDuration: 800,
        transitionInterpolator: new FlyToInterpolator({ speed: 2 })
      });
    } catch (error) {
      console.log(`Unable to set the bounding box`, feature);
      console.error(error);
    }
    editorStore.setFocusedFeatureId(null);
  }
});

const updateViewState = (_viewState) => {
  baseMap.jumpTo({
    center: [_viewState.longitude, _viewState.latitude],
    zoom: _viewState.zoom,
    bearing: _viewState.bearing,
    pitch: _viewState.pitch,
    essential: true,
  });

  foregroundMap.jumpTo({
    center: [_viewState.longitude, _viewState.latitude],
    zoom: _viewState.zoom,
    bearing: _viewState.bearing,
    pitch: _viewState.pitch,
    essential: true,
  });
  viewState.value = _viewState;
};

const zoomIn = () => {
  updateViewState({ ...viewState.value, zoom: Math.min(viewState.value.zoom + 1, 20) });
};

const zoomOut = () => {
  updateViewState({ ...viewState.value, zoom: Math.max(viewState.value.zoom - 1, 1) });
};

const fitScreen = () => { editorStore.updateBoundingBox(); };

watch(activeMapStyleURL, () => {
  if (baseMap) {
    baseMap.setStyle(activeMapStyleURL.value);
  }
});

const updateViewStateWithBoundingBox = (bbox) => {
  if (bbox) {
    const { width, height } = deckContainerRef.value.getBoundingClientRect();
    const vs = new WebMercatorViewport({ ...viewState.value, width, height });
    try {
      const boundedViewState = vs.fitBounds(bbox);
      let { latitude, longitude, zoom, bearing, pitch } = boundedViewState;
      updateViewState({
        latitude,
        longitude,
        zoom: zoom > 19 ? 19 : zoom,
        bearing,
        pitch,
        transitionDuration: 800,
        transitionInterpolator: new FlyToInterpolator({ speed: 2 })
      });
    } catch (error) {
      console.error(`We fucked up`, error);
    }
  }
}
watch(boundingBox, (bbox) => { updateViewStateWithBoundingBox(bbox); });

// expose to template
defineExpose({ viewState, updateViewState, showMapLabels, deckContainerRef, map, fgmap, MapController, zoomIn, zoomOut, fitScreen, setShowMapSearch });
</script>

<style lang="scss" scoped>
.deck-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#base-map,
#foreground-map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #e5e9ec;
  overflow: hidden;
}

#foreground-map {
  background: transparent;
  pointer-events: none;
  opacity: 1;
}

#deck-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
