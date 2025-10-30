<template>
  <div class="base-map-options">
    <div class="header">
      <div class="icon">
        <Icon icon="mdi:map-outline" width="18" height="18" />
      </div>
      <h4>{{ $t('itemOptions.visuals') }}</h4>
    </div>
    <v-section :title="$t('itemOptions.mapStyle')">
      <div class="map-style-selector" ref="selectorRef">
        <div class="dropdown-select" @click="openDropDownOptions">
          <img :src="styles[activeStyle].image" :alt="styles[activeStyle].name" class="thumbnail" />
          <dl>
            <dt>{{ $t(`mapboxStyles.${styles[activeStyle].name}`) }}</dt>
            <dd>Mapbox {{ $t('style') }}</dd>
          </dl>
          <Icon icon="mdi:chevron-down" :class="['icon', { rotate: showDropDownOptions }]" width="18" height="18" />
        </div>
        <div v-if="showDropDownOptions" class="dropdown-options" v-click-away="() => {
          showDropDownOptions = false;
        }
          ">
          <div v-for="item in styleItems" :key="item.id" class="item" @click="selectActiveMapStyle(item.id)">
            <img :src="item.image" :alt="item.name" class="thumbnail" />
            <dl>
              <dt>{{ $t(`mapboxStyles.${item.name}`) }}</dt>
              <dd>Mapbox {{ $t('style') }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </v-section>
    <v-section>
      <div class="item-row">
        <VCheckBox :modelValue="showMapLabels" @update:modelValue="(value) => setShowMapLabels(value)"
          :label="$t('itemOptions.showMapLabels')" />
      </div>
    </v-section>
    <v-section>
      <div class="item-row">
        <VCheckBox :modelValue="getShowPropertiesPopup" @update:modelValue="(value) => setShowPropertiesPopup(value)"
          :label="$t('itemOptions.showPropertiesOnHover')" />
      </div>
    </v-section>
  </div>
</template>

<script setup lang="ts">
import VSection from "@/components/base/v-section.vue";
import { Icon } from "@iconify/vue";
import VCheckBox from "@/components/base/v-checkbox.vue";
import { useMapStore } from "@/stores/map";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const store = useMapStore() as any;
const styles = computed(() => store.getAllMapStyles);
const styleItems = computed(() => Object.values(styles.value || {}) as any[])
const activeStyle = computed(() => store.getActiveMapStyleId);
const showMapLabels = computed(() => store.getShowMapLabels);
const getShowPropertiesPopup = computed(() => store.getShowPropertiesPopup);
const showDropDownOptions = ref(false);
const setShowMapLabels = store.setShowMapLabels;
const setShowPropertiesPopup = store.setShowPropertiesPopup;

const openDropDownOptions = () => { showDropDownOptions.value = !showDropDownOptions.value };
const selectActiveMapStyle = (mapStyle: string) => {
  store.setActiveMapStyleId(mapStyle);
  showDropDownOptions.value = false;
};

const selectorRef = ref<HTMLElement | null>(null);
const onDocumentClick = (event: MouseEvent) => {
  const el = selectorRef.value as HTMLElement | null;
  if (el && !el.contains(event.target as Node)) {
    showDropDownOptions.value = false;
  }
};
onMounted(() => {
  document.addEventListener('click', onDocumentClick);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick);
});
</script>

<style lang="scss" scoped>
.base-map-options {
  display: flex;
  flex-direction: column;

  .header {
    padding: 10px;
    border-bottom: 1px solid var(--color-secondary-light);
    display: flex;
    align-items: center;

    .icon {
      background: var(--color-tirtiary-light);
      color: var(--color-tirtiary);
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
    }
  }

  .map-style-selector {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    position: relative;

    .dropdown-select {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px;
      border-radius: 3px;

      .thumbnail {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 3px;
        border: 1px solid var(--color-secondary-light);
      }

      .icon {
        transition: 0.1s all ease-in-out;

        &.rotate {
          transform: rotate(180deg);
        }
      }

      dl {
        margin-left: 10px;
        flex: 1;

        dt {
          font-weight: bold;
        }

        dd {
          color: var(--font-color-light);
        }
      }

      &:hover {
        cursor: pointer;
        background: var(--color-secondary-light);
      }
    }

    .dropdown-options {
      display: flex;
      flex-direction: column;
      max-height: 300px;
      overflow: auto;
      border: 1px solid var(--border-color);
      border-radius: 3px;
      box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
      background: var(--color-secondary);
      position: absolute;
      top: 60px;
      left: 0;
      width: 100%;

      .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px;
        border-radius: 3px;

        .thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 3px;
          border: 1px solid var(--color-secondary-light);
        }

        dl {
          margin-left: 10px;
          flex: 1;

          dt {
            font-weight: bold;
          }

          dd {
            color: var(--font-color-light);
          }
        }

        &:hover {
          cursor: pointer;
          background: var(--color-secondary-light);
        }
      }
    }
  }

  .item-row {
    padding: 10px 0;
  }
}
</style>
