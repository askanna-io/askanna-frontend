<template>
  <div class="col-3 dot-flashing-wrapper" :class="wrapperClasses">
    <div class="snippet" data-title=".dot-flashing">
      <div class="stage">
        <div class="dot-flashing"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  inline: {
    type: Boolean,
    default: false
  }
})
const wrapperClasses = {
  absolute: !props.inline,
  'd-inline-flex': props.inline
}
</script>
<style scoped lang="scss">
.dot-flashing-wrapper {
  bottom: 5px;

  &.absolute {
    padding-left: 32px;
    position: absolute;
  }

  &.d-inline-flex {
    padding: 0;
    padding-left: 20px;
  }
}
.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: var(--v-primary-base);
  color: var(--v-primary-base);
  animation: dotFlashing 1s infinite linear alternate;
  animation-delay: 0.5s;
}

.dot-flashing::before,
.dot-flashing::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: var(--v-primary-base);
  color: var(--v-primary-base);
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: var(--v-primary-base);
  color: var(--v-primary-base);
  animation: dotFlashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dotFlashing {
  0% {
    background-color: var(--v-primary-base);
  }
  50%,
  100% {
    background-color: #f5f5f5;
  }
}
</style>
