<template>
  <VToolbarTitle v-bind="$attrs" v-on="$listeners">
    <slot />
  </VToolbarTitle>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
