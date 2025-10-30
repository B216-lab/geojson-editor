<template>
  <div :class="[
    'feature-item',
    { isHoveredFeature, isSelectedFeature },
    { isHidden },
  ]" @click="setAsActiveFeature">
    <div class="icon" @dblclick.prevent="focusFeature">
      <Icon :icon="iconForShape(feature.geometry.type)" width="16" height="16" />
    </div>
    <form @submit.prevent="featureNameInput && featureNameInput.blur()" @dblclick="setEditable">
      <input type="text" name="featureName" ref="featureNameInput" v-model="featureName" :readonly="readonly" size="2"
        @blur="renameFeature" @focus="setEditable" />
      <input v-show="false" type="submit" />
    </form>
    <div v-if="isEditable" class="visibility-icon" @click.stop="toggleVisibility">
      <Icon :icon="isHidden ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" width="18" height="18" />
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { computed, ref, watch } from "vue";
import { useStoreModule } from "@/composables/useStoreModule.js";
import { FEATURE_TYPES } from '@/models/Feature.model';

const props = defineProps({
  feature: {
    type: Object,
    required: true,
  },
  isHoveredFeature: {
    type: Boolean,
    default: false,
  },
  isSelectedFeature: {
    type: Boolean,
    default: false,
  },
  isEditable: {
    type: Boolean,
    default: false,
  },
});

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

const readonly = ref(true);
const featureNameInput = ref(null);
const featureName = ref(props.feature.properties.name);
const isHidden = computed(() => props.feature.properties.isHidden);
const { actions } = useStoreModule("editor");

const setAsActiveFeature = (event) => {
  const { metaKey, ctrlKey, shiftKey } = event;
  if (shiftKey) {
    actions.customSelectFeatureId({
      featureId: props.feature.properties.id,
      isMultiSelect: true,
    });
  } else if (metaKey || ctrlKey) {
    actions.customSelectFeatureId({
      featureId: props.feature.properties.id,
      deselect: props.isSelectedFeature,
      isMultiSelect: false,
    });
  } else {
    actions.setSelectedFeatureIds([props.feature.properties.id]);
  }
};

const renameFeature = () => {
  readonly.value = true;
  if (featureName.value) {
    actions.updateFeatureProperties({
      featureId: props.feature.properties.id,
      properties: { name: featureName.value },
    });
  } else {
    featureName.value = props.feature.properties.name;
  }
};

const toggleVisibility = () => {
  actions.updateFeatureProperties({
    featureId: props.feature.properties.id,
    properties: { isHidden: !isHidden.value },
  });
};

const focusFeature = () => {
  actions.setFocusedFeatureId(props.feature.properties.id);
};

const setEditable = () => {
  if (props.isEditable) {
    readonly.value = false;
  }
};

watch(readonly, (value) => {
  if (!value) {
    featureNameInput.value.focus();
    featureNameInput.value.select();
  }
});
</script>

<style lang="scss" scoped>
.feature-item {
  padding: 0px 15px;
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: var(--color-secondary-transparent);

  .icon {
    margin-right: 8px;
  }

  form {
    flex: 1;
    display: flex;
    flex-direction: column;

    input {
      flex: 1;
      padding: 5px;
      margin-bottom: 2px;
      border: 1px solid transparent;
      background: transparent;
      border-radius: 2px;

      &[readonly] {
        pointer-events: none;
      }

      &:focus {
        border: 1px solid var(--color-primary);
        outline: none;
        background: var(--color-secondary);
      }
    }
  }

  .visibility-icon {
    display: none;
    padding: 5px;
  }

  &:hover {
    cursor: pointer;
    background: var(--color-secondary-light);

    .visibility-icon {
      display: flex;
    }
  }

  &.isHoveredFeature {
    background: var(--color-secondary-light);
  }

  &.isSelectedFeature {
    background: var(--color-primary-light);
  }

  &.isHidden {
    opacity: 0.5;

    .visibility-icon {
      display: flex;
    }
  }
}
</style>
