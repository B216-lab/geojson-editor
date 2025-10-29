<template>
  <div class="map-controls">
    <div class="control-wrapper">
      <div class="icon-button" role="button" @click="$emit('onClickSearch')">
        <Icon icon="mdi:magnify" class="icon" width="20" height="20" />
      </div>
    </div>
    <div class="control-wrapper">
      <div class="icon-button" role="button" @click="$emit('onClickZoomIn')">
        <Icon icon="mdi:plus" class="icon" width="20" height="20" />
      </div>
      <div class="icon-button" role="button" @click="$emit('onClickZoomOut')">
        <Icon icon="mdi:minus" class="icon" width="20" height="20" />
      </div>
    </div>
    <div class="control-wrapper">
      <div class="icon-button" role="button" @click="$emit('onClickFitScreen')">
        <Icon icon="mdi:fit-to-screen-outline" class="icon" width="20" height="20" />
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon
  },
};
</script>

<style lang="scss" scoped>
.map-controls {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 99;

  .control-wrapper {
    display: flex;
    flex-direction: column;
    background: var(--color-secondary);
    border-radius: 6px;
    box-shadow: var(--smooth-shadow);
    padding: 2px;
    margin-bottom: 10px;

    .icon-button {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: var(--color-secondary-light);
        cursor: pointer;
      }
    }
  }
}
</style>
