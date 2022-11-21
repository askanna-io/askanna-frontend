<template>
  <VDivider v-bind="$attrs" v-on="$listeners">
    <slot />
  </VDivider>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
