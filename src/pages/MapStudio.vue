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

<script setup>
import NavBar from "@/components/studio/NavBar.vue";
import ExplorerPanel from "@/components/studio/Explorer/ExplorerPanel.vue";
import DetailsPanel from "@/components/studio/DetailsPanel.vue";
import { computed, defineAsyncComponent, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { useUIStore } from "@/stores/ui";
import { useMapStore } from "@/stores/map";
import { useEditorStore } from "@/stores/editor";
import { useRoute } from "vue-router";

const EditorView = defineAsyncComponent({
  loader: () => import("@/components/studio/Editor/EditorView.vue"),
  loadingComponent: "",
});

const studioLayoutRef = ref(null);
const uiStore = useUIStore();
const mapStore = useMapStore();
const editorStore = useEditorStore();
const isLoading = ref(false);
const route = useRoute();
const isPreviewMode = computed(() => !!route.query?.preview);

const initializeProject = async () => {
  isLoading.value = true;
  // Initialize editor state with an empty map context
  await editorStore.loadEditorData({ title: 'Untitled Map', features: {} });
  isLoading.value = false;
};

onMounted(() => {
  initializeProject();
});

const resetSotres = () => {
  mapStore.reset();
  editorStore.reset();
};
onBeforeUnmount(resetSotres);
onBeforeMount(resetSotres);
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
