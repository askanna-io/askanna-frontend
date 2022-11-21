<template>
  <VCardSubtitle v-bind="$attrs" v-on="$listeners">
    <slot />
  </VCardSubtitle>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
