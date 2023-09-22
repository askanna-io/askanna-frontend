<template>
  <VCardActions v-bind="$attrs">
    <slot />
  </VCardActions>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
