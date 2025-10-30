<template>
  <div class="nav-bar">
    <div class="tool-bar">
      <div v-if="accessFlags.showTools" class="draw-tools" @mouseenter="createToolTipTrigger"
        @mouseleave="clearToolTipTrigger">
        <div v-for="(tool, index) in tools" :key="tool.id" :class="['tool', { active: activeTool === tool.id }]"
          @click="setActiveTool(tool.id)" @mouseenter="setActiveHoverItemIndex(index)">
          <Icon :icon="iconForTool(tool.id)" width="18" height="18" />
        </div>
        <div v-if="showHelpToolTip" class="help-tooltip" :style="{
          transform: `translateX(${activeHoverItemIndex * 42}px)`,
        }">
          <h4>
            {{ hoveredTool.name }}
            <span class="shortcut">{{ hoveredTool.shortcut }}</span>
          </h4>
          <p>
            {{ hoveredTool.description }}
          </p>
        </div>
      </div>
      <div v-else class="view-options"></div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { MAP_TOOLS } from "@/stores/editor";
import { computed, ref, watch } from "vue";
import { useStoreModule } from "@/composables/useStoreModule.js";

export default {
  components: {
    Icon,
  },
  setup() {
    const { getters, actions } = useStoreModule("editor");
    const UIStore = useStoreModule("UI");
    const accessFlags = computed(() => UIStore.getters.getAccessFlags);
    const activeTool = computed(() => getters.getActiveTool);
    const tools = Object.values(MAP_TOOLS);
    const setActiveTool = actions.setActiveTool;
    const iconForTool = (toolId) => {
      switch (toolId) {
        case "select":
          return "mdi:cursor-default-outline";
        case "polygon":
        case "rectangle":
        case "ellipse":
          return "mdi:shape-outline";
        case "line":
          return "mdi:vector-line";
        case "point":
          return "mdi:map-marker-outline";
        case "measure":
          return "mdi:ruler";
        default:
          return "mdi:shape-outline";
      }
    };
    const activeHoverItemIndex = ref(0);
    const hoveredTool = computed(() => tools[activeHoverItemIndex.value]);
    const showHelpToolTip = ref(false);
    const tooltipTrigger = ref(null);



    const setActiveHoverItemIndex = (index) => {
      activeHoverItemIndex.value = index;
    };

    const createToolTipTrigger = () => {
      tooltipTrigger.value = setTimeout(() => {
        showHelpToolTip.value = true;
      }, 1000);
    };

    const clearToolTipTrigger = () => {
      showHelpToolTip.value = false;
      if (tooltipTrigger.value) {
        window.clearTimeout(tooltipTrigger.value);
      }
    };

    return {
      accessFlags,
      tools,
      activeTool,
      setActiveTool,
      setActiveHoverItemIndex,
      hoveredTool,
      activeHoverItemIndex,
      showHelpToolTip,
      clearToolTipTrigger,
      createToolTipTrigger,
      iconForTool,
    };
  },
};
</script>

<style lang="scss" scoped>
.nav-bar {
  display: grid;
  height: 50px;
  background: var(--color-dark-background);
  grid-template-columns: 270px 1fr 270px;
  color: var(--color-secondary);

  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 5px 5px 5px 10px;

    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px 5px 5px 0;
      color: var(--color-secondary);

      &:hover {
        cursor: pointer;
      }
    }

  }

  .tool-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-left: 1px solid var(--color-dark-background-light);
    border-right: 1px solid var(--color-dark-background-light);

    .draw-tools {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      position: relative;

      .tool {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: transparent;
        border-radius: 3px;
        margin-right: 2px;
        opacity: 0.7;

        &:hover {
          cursor: pointer;
          background: var(--color-dark-background-light);
          opacity: 1;
        }

        &.active {
          background: var(--color-primary);
          opacity: 1;
        }
      }

      .help-tooltip {
        width: 200px;
        position: absolute;
        top: 60px;
        left: -90px;
        z-index: 4;
        background: var(--color-primary);
        color: var(--color-secondary);
        padding: 10px;
        border-radius: 6px;
        transition: 0.2s all ease-in-out;

        &:after {
          content: " ";
          position: absolute;
          bottom: 100%;
          /* At the top of the tooltip */
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: transparent transparent var(--color-primary) transparent;
        }

        h4,
        p {
          color: var(--color-secondary);
        }

        h4 {
          font-weight: bold;

          span.shortcut {
            opacity: 0.5;
            margin-left: 5px;
            color: var(--color-secondary);
            text-transform: capitalize;
          }
        }
      }
    }
  }

  .map-options {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0px;
  }
}
</style>
