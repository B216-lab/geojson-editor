<template>
  <div class="feature-details">
    <v-section :title="$t('featureDetails.measures')" bold>
      <div class="metadata uneditable">
        <dl v-for="itemKey in Object.keys(defaultProperties)" :key="itemKey" class="item">
          <dt>{{ defaultProperties[itemKey].name }}</dt>
          <dd>{{ defaultProperties[itemKey].value }}</dd>
        </dl>
      </div>
    </v-section>
    <v-section :title="$t('featureDetails.customProperties')" bold>
      <template v-if="isShapesEditable" v-slot:header>
        <button class="add-btn" @click="addNewProperty">
          <Icon icon="mdi:plus" width="20" height="20" />
        </button>
      </template>
      <EditablePropertyRow v-for="itemKey in [...Object.keys(customProperties)].reverse()" :key="itemKey"
        :name="itemKey" :value="customProperties[itemKey]" @update="
          ({ name, value }) => updateProperty({ itemId: itemKey, name, value })
        " :disabled="!isShapesEditable" @delete="deleteProperty" />
    </v-section>
  </div>
</template>

<script setup lang="ts">
import VSection from "@/components/base/v-section.vue";
import { computed } from "vue";
import { DEFAULT_PROPERTIES } from "@/models/Feature.model";
import { areaFormatter, distanceFormatter } from "@/utils/formatter";
import { Icon } from "@iconify/vue";
import EditablePropertyRow from "./EditablePropertyRow.vue";
import { useEditorStore } from "@/stores/editor";
import { useUIStore } from "@/stores/ui";

const props = defineProps<{ feature: any }>()
const editorStore = useEditorStore();
const uiStore = useUIStore();
const isShapesEditable = computed(() => uiStore.getAccessFlags.isShapesEditable);
const defaultProperties = computed(() => {
  const { area, distance, perimeter, pointRadius, radiusScale } = props.feature.properties;
  const rawMeta: Record<string, any> = {
    area: area && areaFormatter(area),
    distance: distance && distanceFormatter(distance),
    perimeter: perimeter && distanceFormatter(perimeter),
    radius: pointRadius && `${pointRadius} ${radiusScale}`,
  };
  const meta: Array<{ name: string; value: any }> = Object.keys(rawMeta).reduce((result: any[], key: string) => {
    if (rawMeta[key]) {
      result.push({ name: key, value: rawMeta[key] });
    }
    return result;
  }, []);
  return meta as any;
});

const customProperties = computed(() => {
  const all = props?.feature?.properties || {};
  const exclude = new Set(DEFAULT_PROPERTIES);
  return Object.keys(all).reduce((acc: Record<string, any>, key: string) => {
    if (!exclude.has(key)) acc[key] = all[key];
    return acc;
  }, {});
});

const propertyIds = computed(() => Object.keys(props.feature.properties));

const generateNextPropertyName = (properties: Record<string, any>) => {
  const regex = new RegExp(`property ([0-9]+)`);
  let currentIndex = 0;
  Object.keys(properties).forEach((key) => {
    const match = key.match(regex);
    if (match) {
      const index = parseInt(match[1]);
      if (index > currentIndex) currentIndex = index;
    }
  });
  return `property ${currentIndex + 1}`;
};

const addNewProperty = () => {
  if (!isShapesEditable.value) return;
  const propertyName = generateNextPropertyName(customProperties.value);
  editorStore.updateFeatureProperties({
    featureId: props.feature?.properties?.id,
    properties: { [propertyName]: "" },
    shouldSync: true,
  });
};

const updateProperty = ({ itemId, name, value }: { itemId: string; name: string; value: any }) => {
  editorStore.updateFeatureProperties({
    featureId: props.feature?.properties?.id,
    properties: propertyIds.value.reduce((result: Record<string, any>, key: string) => {
      if (key === itemId) {
        result[name] = value;
      } else {
        result[key] = props.feature?.properties[key];
      }
      return result;
    }, {}),
    replaceProperties: true,
    shouldSync: true,
  });
};

const deleteProperty = (name: string) => {
  editorStore.updateFeatureProperties({
    featureId: props.feature?.properties?.id,
    properties: propertyIds.value.reduce((result: Record<string, any>, key: string) => {
      if (key !== name) {
        result[key] = props.feature?.properties[key];
      }
      return result;
    }, {}),
    replaceProperties: true,
    shouldSync: true,
  });
};
</script>

<style lang="scss" scoped>
.feature-details {
  display: flex;
  flex-direction: column;
  flex: 1;

  .metadata {
    display: flex;
    flex-direction: column;
    margin-top: 5px;

    .item {
      display: flex;
      padding: 8px 0;
      //   border-bottom: 1px solid var(--color-secondary-light);

      &:last-child {
        border-bottom: none;
      }

      dt,
      dd {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      dt {
        text-transform: capitalize;
      }
    }
  }

  .add-btn {
    border: 0;
    padding: 5px;
    margin: 0;
    background: transparent;
    border-radius: 5px;
    display: flex;

    &:hover {
      cursor: pointer;
      background: var(--color-secondary-light);
    }
  }
}
</style>
