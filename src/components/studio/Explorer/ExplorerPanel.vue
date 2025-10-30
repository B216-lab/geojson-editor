<template>
  <div class="explorer-panel">
    <div class="header">
      <h4 class="title">
        <Icon icon="mdi:layers-outline" class="icon" width="18" height="18" />
        <span>Features</span>
      </h4>
    </div>
    <feature-list />
  </div>
</template>

<script>
import { useStoreModule } from "@/composables/useStoreModule.js";
import { Icon } from "@iconify/vue";
import { computed, defineComponent } from "vue";
import FeatureList from "./FeatureList.vue";

export default defineComponent({
  components: {
    Icon,
    FeatureList,
  },
  setup() {
    const UIStore = useStoreModule("UI");
    const isShapesEditable = computed(
      () => UIStore.getters.getAccessFlags.isShapesEditable
    );

    return {
      isShapesEditable,
    };
  },
});
</script>

<style lang="scss" scoped>
.explorer-panel {
  display: flex;
  flex-direction: column;
  background: var(--color-secondary);
  overflow: hidden;
  border-right: 1px solid var(--color-secondary-light);

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-secondary-light);
    background: var(--color-secondary);
    padding: 0 5px;

    .title {
      padding: 10px;
      border-bottom: 2px solid transparent;
      display: flex;
      align-items: center;
      color: var(--font-color);

      span {
        margin-left: 10px;
        color: currentColor;
        font-weight: bold;
      }
    }
  }
}
</style>
