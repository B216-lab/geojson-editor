<template>
  <div v-if="feature && x && y" class="geo-popup" :style="{
    top: `${y + 10}px`,
    left: `${x + 10}px`,
  }">
    <div class="header">
      <div class="icon">
        <Icon :icon="iconForShape(feature.geometry.type)" width="18" height="18" />
      </div>
      <h4>{{ feature.properties.name }}</h4>
    </div>
    <div v-if="showProperties" class="contents">
      <dl v-for="(metadata, index) in meta" :key="`meta-${index}`" class="metadata-item">
        <dt class="title">{{ metadata.name }}</dt>
        <dd class="value">{{ metadata.value }}</dd>
      </dl>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { areaFormatter, distanceFormatter } from "@/utils/formatter.js";
import { DEFAULT_PROPERTIES, FEATURE_TYPES } from "@/models/Feature.model";
import { computed } from "vue";

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
    feature: {
      type: Object,
    },
    showProperties: {
      type: Boolean,
    },
  },
  setup(props) {
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

    const customProperties = computed(() => {
      const all = props.feature?.properties || {};
      const exclude = new Set(DEFAULT_PROPERTIES);
      return Object.keys(all).reduce((acc, key) => {
        if (!exclude.has(key)) acc[key] = all[key];
        return acc;
      }, {} as Record<string, any>);
    });

    const meta = computed(() => {
      if (!props.feature) return {};
      const { area, perimeter, distance, pointRadius, radiusScale } =
        props.feature.properties;

      const rawMeta = {
        area: area && areaFormatter(area),
        distance: distance && distanceFormatter(distance),
        perimeter: perimeter && distanceFormatter(perimeter),
        radius: pointRadius && `${pointRadius} ${radiusScale}`,
        ...Object.keys(customProperties.value)
          .slice(0, 3)
          .reduce(
            (result, key) => ({
              ...result,
              [key]: customProperties.value[key],
            }),
            {}
          ),
      };
      const meta = Object.keys(rawMeta).reduce((result, key) => {
        if (rawMeta[key]) {
          result.push({
            name: key,
            value: rawMeta[key],
          });
        }
        return result;
      }, []);
      return meta;
    });

    return { iconForShape, meta };
  },
};
</script>

<style lang="scss" scoped>
.geo-popup {
  width: 200px;
  background: var(--color-secondary);
  position: absolute;
  pointer-events: none;
  z-index: 99;
  border-radius: 2px;
  border: 1px solid var(--color-secondary-light);
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);

  // transition: 0.01s ease-in-out;

  .header {
    padding: 10px;
    display: flex;
    align-items: center;

    .icon {
      background: var(--color-primary-light);
      color: var(--color-primary);
      width: 24px !important;
      height: 24px !important;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      margin-right: 5px;
    }

    h4 {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .contents {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--color-secondary-light);

    .metadata-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px;

      .title {
        // font-weight: bold;
        // text-transform: capitalize;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .value {
        // font-weight: bold;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
