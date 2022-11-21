<template>
  <VSlideYTransition v-bind="$attrs" v-on="$listeners">
    <slot />
  </VSlideYTransition>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
