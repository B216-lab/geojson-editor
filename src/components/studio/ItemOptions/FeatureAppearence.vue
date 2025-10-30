<template>
  <div class="feature-appearences">
    <v-section v-if="enableFillColor" :title="'Fill Color'">
      <v-color-picker :color="feature.properties.fillColor" :hide="feature.properties.hideFill"
        @onChangeColor="updateFillColor" @onChangeHide="updateHideFill" />
    </v-section>
    <v-section v-if="enableLineProperties" :title="'Line Color'">
      <v-color-picker :color="feature.properties.lineColor" :hide="feature.properties.hideLine"
        @onChangeColor="updateLineColor" @onChangeHide="updateHideLine" />
    </v-section>
    <v-section v-if="enablePointProperties" :title="'Point Radius'">
      <v-scale-input :value="feature.properties.pointRadius" :scale="feature.properties.radiusScale"
        :icon="'RadiusIcon'" @onWidthChange="updatePointRadius" @onScaleChange="updateRadiusScale" />
    </v-section>
  </div>
</template>

<script setup lang="ts">
import VSection from "@/components/base/v-section.vue";
import VScaleInput from "@/components/base/v-scale-input.vue";
// FEATURE_TYPES kept for reference; type checks use string values
import { computed } from "vue";
import { useStoreModule } from "@/composables/useStoreModule.js";
const debounce = (fn: Function, delay = 300) => {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

const props = defineProps<{ feature: any }>()

const featureType = computed(() => props.feature.geometry.type as string);
const enableFillColor = computed(() => {
  return (
    featureType.value === 'Polygon' ||
    featureType.value === 'MultiPolygon' ||
    featureType.value === 'Point'
  );
});

const enableLineProperties = computed(() => {
  return (
    featureType.value === 'Polygon' ||
    featureType.value === 'MultiPolygon' ||
    featureType.value === 'Point' ||
    featureType.value === 'LineString' ||
    featureType.value === 'MultiLineString'
  );
});

const enablePointProperties = computed(() => featureType.value === 'Point');

const { actions } = useStoreModule("editor") as any;

const debouncedFeatureSync = debounce(() => {
  actions.syncFeatureProperties({ featureId: props.feature.properties.id });
}, 500);

const updateFillColor = (color: any) => {
  if (JSON.stringify(props.feature.properties.fillColor) !== JSON.stringify(color)) {
    actions.updateFeatureProperties({
      featureId: props.feature.properties.id,
      properties: { fillColor: color },
      shouldSync: false,
    });
    debouncedFeatureSync();
  }
};

const updateHideFill = (isHidden: boolean) => {
  actions.updateFeatureProperties({
    featureId: props.feature.properties.id,
    properties: { hideFill: isHidden },
    shouldSync: false,
  });
  debouncedFeatureSync();
};

const updateLineColor = (color: any) => {
  if (JSON.stringify(props.feature.properties.lineColor) !== JSON.stringify(color)) {
    actions.updateFeatureProperties({
      featureId: props.feature.properties.id,
      properties: { lineColor: color },
      shouldSync: false,
    });
    debouncedFeatureSync();
  }
};

const updateHideLine = (isHidden: boolean) => {
  actions.updateFeatureProperties({
    featureId: props.feature.properties.id,
    properties: { hideLine: isHidden },
    shouldSync: false,
  });
  debouncedFeatureSync();
};


const updatePointRadius = (radius: number) => {
  if (props.feature.properties.pointRadius !== radius) {
    actions.updateFeatureProperties({
      featureId: props.feature.properties.id,
      properties: { pointRadius: radius },
      shouldSync: false,
    });
    debouncedFeatureSync();
  }
};


const updateRadiusScale = (scale: string) => {
  actions.updateFeatureProperties({
    featureId: props.feature.properties.id,
    properties: { radiusScale: scale, pointRadius: 1 },
    shouldSync: false,
  });
  debouncedFeatureSync();
};
</script>

<style lang="scss" scoped>
.feature-appearences {
  display: flex;
  flex-direction: column;
}
</style>
