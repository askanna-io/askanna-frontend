<template>
  <div
    :class="wrapperClasses"
    class="col-3 dot-flashing-wrapper"
  >
    <div
      class="snippet"
      data-title="dot-flashing"
    >
      <div class="stage">
        <div class="dot-flashing"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { theme } from '/askanna.conf.json'

const props = defineProps({
  inline: {
    type: Boolean,
    default: false
  }
})

const primaryColor = ref(theme.colors.primary)
const wrapperClasses = {
  'absolute bot': !props.inline,
  'inline-flex': props.inline
}
</script>
<style scoped lang="scss">
.dot-flashing-wrapper.absolute {
  left: 33px;
  bottom: 15px;
}

.dot-flashing {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: v-bind(primaryColor);
  color: v-bind(primaryColor);
  animation: dot-flashing 1s infinite linear alternate;
  animation-delay: 0.5s;

}

.dot-flashing::before,
.dot-flashing::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
}

.dot-flashing::before {
  left: -15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: v-bind(primaryColor);
  color: v-bind(primaryColor);
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 0s;
}

.dot-flashing::after {
  left: 15px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: v-bind(primaryColor);
  color: v-bind(primaryColor);
  animation: dot-flashing 1s infinite alternate;
  animation-delay: 1s;
}

@keyframes dot-flashing {
  0% {
    background-color: v-bind(primaryColor);
  }

  50%,
  100% {
    background-color: #f5f5f5;
  }
}
</style>
