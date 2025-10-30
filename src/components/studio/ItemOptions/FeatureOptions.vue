<template>
  <div class="feature-options">
    <div class="header">
      <div class="icon">
        <Icon :icon="iconForShape(feature.geometry.type)" width="18" height="18" />
      </div>
      <h4 class="ellipsis">{{ feature.properties.name }}</h4>
    </div>
    <div class="content">
      <FeatureAppearence :feature="feature" />
      <FeatureDetails :feature="feature" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import FeatureAppearence from "./FeatureAppearence.vue";
import FeatureDetails from "./FeatureDetails.vue";
import { useStoreModule } from "@/composables/useStoreModule";
import { FEATURE_TYPES } from "@/models/Feature.model";

defineProps<{ feature: any }>()

const UIStore = useStoreModule("UI");
const isShapesEditable = computed(() => UIStore.getters.getAccessFlags.isShapesEditable);

const tabs = computed(() => ({
  ...(isShapesEditable.value ? { appearence: { id: 'appearence', name: 'Appearence', component: 'FeatureAppearence' } } : {}),
  details: { id: 'details', name: 'Details', component: 'FeatureDetails' },
}))

const activeTab = ref('details')
const activeComponent = computed(() => (tabs.value as any)[activeTab.value].component)
onMounted(() => { activeTab.value = Object.keys(tabs.value)[0] })

const iconForShape = (type: string) => {
  switch (type) {
    case FEATURE_TYPES.Polygon:
    case FEATURE_TYPES.MultiPolygon:
      return 'mdi:shape-outline'
    case FEATURE_TYPES.LineString:
    case FEATURE_TYPES.MultiLineString:
      return 'mdi:vector-line'
    case FEATURE_TYPES.Point:
      return 'mdi:map-marker-outline'
    default:
      return 'mdi:shape-outline'
  }
}
</script>

<style lang="scss" scoped>
.feature-options {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-secondary);
  overflow: hidden;

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
      font-weight: 600;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;
    padding-bottom: 100px;
  }
}
</style>
