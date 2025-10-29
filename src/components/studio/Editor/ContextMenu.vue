<template>
  <div class="context-menu" :style="{
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

<script>
import { Icon } from "@iconify/vue";

import { computed } from "vue";
import { useStoreModule } from "@/composables/useStoreModule.js";
import { FEATURE_TYPES } from "@/models/Feature.model";
import { EDITING_MODE } from "@/stores/editor";

export default {
  components: {
    Icon,
  },
  props: {
    x: {
      type: Number,
      default: 0,
    },
    y: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    feature: {
      type: Object,
    },
  },
  setup(props, { emit }) {
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

    const UIStore = useStoreModule("UI");
    const MapStore = useStoreModule("map");
    const accessFlags = computed(() => UIStore.getters.getAccessFlags);
    const options = computed(() => [
      ...(props.feature && accessFlags.value.isShapesEditable
        ? [
          ...(props.feature.geometry.type !== FEATURE_TYPES.Point
            ? [
              {
                id: "modify",
                icon: "mdi:vector-polyline-edit",
                name: "Modify",
              },
              {
                id: "transform",
                icon: "mdi:axis-arrow",
                name: "Transform",
              },
            ]
            : []),
          {
            id: "delete",
            icon: "mdi:trash-can-outline",
            name: "Delete",
          },
        ]
        : []),
      ...(props.latitude && props.longitude
        ? [
          {
            id: "searchArea",
            icon: "mdi:magnify",
            name: "Search this area",
          },
          {
            id: "copycords",
            icon: "mdi:content-copy",
            name: "Copy Coordinates",
          },
        ]
        : []),
    ]);

    const copyCoordinates = () => {
      navigator?.clipboard?.writeText(`${props.latitude}, ${props.longitude}`);
    };
    const { actions } = useStoreModule("editor");
    const selectOption = (itemId) => {
      switch (itemId) {
        case "modify":
          actions.setActiveEditMode({
            featureId: props.feature?.properties?.id,
            mode: EDITING_MODE.modify.id,
          });
          break;
        case "transform":
          actions.setActiveEditMode({
            featureId: props.feature?.properties?.id,
            mode: EDITING_MODE.transform.id,
          });
          break;
        case "delete":
          actions.deleteFeatureById({
            featureId: props.feature?.properties?.id,
          });
          break;
        case "searchArea":
          MapStore.actions.setSearchLocation([props.latitude, props.longitude]);
          UIStore.actions.setShowMapSearch(true);
          break;
        case "copycords":
          copyCoordinates();
          break;
      }
      emit("close");
    };

    return { iconForShape, options, selectOption };
  },
};
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
  // transition: 0.01s ease-in-out;

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
