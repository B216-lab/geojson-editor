<template>
  <div class="feature-list-wrapper">
    <div v-if="features && features.length" class="feature-list">
      <div>
        <feature-item v-for="item in features" :key="item.id" :feature="item"
          :isHoveredFeature="hoveredFeatureId === item?.properties?.id" :isSelectedFeature="item.isSelected"
          :isEditable="isShapesEditable" @contextmenu.prevent="($event) => showFeatureOptions($event, item)" />
      </div>
    </div>
    <div v-else class="not-found">
      <p class="description">
        Click on the <strong>tools</strong> on top to start creating features or
        drag and drop a <strong>.geojson</strong>, <strong>.json</strong>or <strong>.csv</strong> file
        to start
      </p>
    </div>
  </div>
  <Teleport to="#app">
    <FeatureContextMenu v-if="isShapesEditable && featuresContextMenuData" :x="featuresContextMenuData.x"
      :y="featuresContextMenuData.y" @close="featuresContextMenuData = null"
      v-click-away="() => (featuresContextMenuData = null)" />
  </Teleport>
</template>

<script setup>
import { useStoreModule } from "@/composables/useStoreModule.js";
import { computed, ref } from "vue";
import FeatureItem from "./FeatureItem.vue";
import FeatureContextMenu from "./FeatureContextMenu.vue";

const { getters, actions } = useStoreModule("editor");
const UIStore = useStoreModule("UI");

const features = computed(() => getters.getFeatures);
const hoveredFeatureId = computed(() => getters.getHoveredFeatureId);
const featuresContextMenuData = ref(null);

const isShapesEditable = computed(
  () => UIStore.getters.getAccessFlags.isShapesEditable
);

const showFeatureOptions = ($event, feature) => {
  const { clientX, clientY } = $event;
  if (!feature.isSelected) {
    actions.setSelectedFeatureIds([feature.id]);
  }
  featuresContextMenuData.value = {
    x: clientX,
    y: clientY,
  };
};
</script>

<style lang="scss" scoped>
.feature-list-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;

  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;

    .empty-icon {
      width: 100px;
      height: 100px;
    }

    .description {
      text-align: center;
      margin: 10px 15px;
      opacity: 0.5;
    }
  }
}

.feature-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-bottom: 300px;
}
</style>
