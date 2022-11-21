<template>
  <VCardTitle v-bind="$attrs" v-on="$listeners">
    <slot />
  </VCardTitle>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
