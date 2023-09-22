<template>
  <VSlideYTransition v-bind="$attrs">
    <slot />
  </VSlideYTransition>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
