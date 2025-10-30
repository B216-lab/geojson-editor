<template>
  <div class="feature-appearences">
    <v-section v-if="enableFillColor" :title="'Fill Color'">
      <v-color-picker
        :color="feature.properties.fillColor"
        :hide="feature.properties.hideFill"
        @onChangeColor="updateFillColor"
        @onChangeHide="updateHideFill"
      />
    </v-section>
    <v-section v-if="enableLineProperties" :title="'Line Color'">
      <v-color-picker
        :color="feature.properties.lineColor"
        :hide="feature.properties.hideLine"
        @onChangeColor="updateLineColor"
        @onChangeHide="updateHideLine"
      />
    </v-section>
    <v-section v-if="enablePointProperties" :title="'Point Radius'">
      <v-scale-input
        :value="feature.properties.pointRadius"
        :scale="feature.properties.radiusScale"
        :icon="'RadiusIcon'"
        @onWidthChange="updatePointRadius"
        @onScaleChange="updateRadiusScale"
      />
    </v-section>
  </div>
</template>

<script setup lang="ts">
import VSection from "@/components/base/v-section.vue";
import VScaleInput from "@/components/base/v-scale-input.vue";
// FEATURE_TYPES kept for reference; type checks use string values
import { computed } from "vue";
import { useEditorStore } from "@/stores/editor";

const props = defineProps<{ feature: any }>();

const featureType = computed(() => props.feature.geometry.type as string);
const enableFillColor = computed(() => {
  return (
    featureType.value === "Polygon" ||
    featureType.value === "MultiPolygon" ||
    featureType.value === "Point"
  );
});

const enableLineProperties = computed(() => {
  return (
    featureType.value === "Polygon" ||
    featureType.value === "MultiPolygon" ||
    featureType.value === "Point" ||
    featureType.value === "LineString" ||
    featureType.value === "MultiLineString"
  );
});

const enablePointProperties = computed(() => featureType.value === "Point");

const editorStore = useEditorStore() as any;

const updateFillColor = (color: any) => {
  if (
    JSON.stringify(props.feature.properties.fillColor) !== JSON.stringify(color)
  ) {
    editorStore.updateFeatureProperties({
      featureId: props.feature.properties.id,
      properties: { fillColor: color },
      shouldSync: false,
    });
  }
};

const updateHideFill = (isHidden: boolean) => {
  editorStore.updateFeatureProperties({
    featureId: props.feature.properties.id,
    properties: { hideFill: isHidden },
    shouldSync: false,
  });
};

const updateLineColor = (color: any) => {
  if (
    JSON.stringify(props.feature.properties.lineColor) !== JSON.stringify(color)
  ) {
    editorStore.updateFeatureProperties({
      featureId: props.feature.properties.id,
      properties: { lineColor: color },
      shouldSync: false,
    });
  }
};

const updateHideLine = (isHidden: boolean) => {
  editorStore.updateFeatureProperties({
    featureId: props.feature.properties.id,
    properties: { hideLine: isHidden },
    shouldSync: false,
  });
};

const updatePointRadius = (radius: number) => {
  if (props.feature.properties.pointRadius !== radius) {
    editorStore.updateFeatureProperties({
      featureId: props.feature.properties.id,
      properties: { pointRadius: radius },
      shouldSync: false,
    });
  }
};

const updateRadiusScale = (scale: string) => {
  editorStore.updateFeatureProperties({
    featureId: props.feature.properties.id,
    properties: { radiusScale: scale, pointRadius: 1 },
    shouldSync: false,
  });
};
</script>

<style lang="scss" scoped>
.feature-appearences {
  display: flex;
  flex-direction: column;
}
</style>
