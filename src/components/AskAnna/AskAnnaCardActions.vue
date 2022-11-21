<template>
  <VCardActions v-bind="$attrs" v-on="$listeners">
    <slot />
  </VCardActions>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
