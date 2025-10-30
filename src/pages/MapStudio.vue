<template>
  <div :class="['studio-layout']" ref="studioLayoutRef">
    <nav-bar />
    <div class="content-layout">
      <explorer-panel />
      <div class="editor-area">
        <editor-view />
      </div>
      <details-panel />
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/studio/NavBar.vue";
import ExplorerPanel from "@/components/studio/Explorer/ExplorerPanel.vue";
import DetailsPanel from "@/components/studio/DetailsPanel.vue";

import {
  computed,
  defineAsyncComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import { useStoreModule } from "@/composables/useStoreModule";
import { useRoute } from "vue-router";
const EditorView = defineAsyncComponent({
  loader: () => import("@/components/studio/Editor/EditorView.vue"),
  loadingComponent: "",
});

export default {
  components: {
    NavBar,
    ExplorerPanel,
    EditorView,
    DetailsPanel,
  },
  setup() {
    const studioLayoutRef = ref(null);
    const UIStore = useStoreModule("UI");
    const MapStore = useStoreModule("map");
    const EditorStore = useStoreModule("editor");
    const ProjectStore = useStoreModule("projects");
    const isLoading = ref(false);
    const route = useRoute();
    const isPreviewMode = computed(() => !!route.query?.preview);

    const initializeProject = async () => {
      isLoading.value = true;
      await ProjectStore.actions.initializeProject();
      isLoading.value = false;
    };

    onMounted(() => {
      initializeProject();
    });

    const resetSotres = () => {
      MapStore.actions.reset();
      EditorStore.actions.reset();
    };
    onBeforeUnmount(resetSotres);
    onBeforeMount(resetSotres);
    return {
      studioLayoutRef,
      isLoading,
      isPreviewMode,
    };
  },
};
</script>

<style lang="scss" scoped>
.studio-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  .content-layout {
    display: grid;
    column-gap: 1px;
    grid-template-columns: 270px 1fr 270px;
    overflow: hidden;

    .editor-area {
      width: 100%;
      height: 100%;
    }
  }

  &.preview {
    grid-template-rows: 1fr;

    .content-layout {
      height: 100%;
      grid-template-columns: 1fr;
    }
  }
}
</style>
