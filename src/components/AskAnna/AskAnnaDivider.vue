<template>
  <VDivider v-bind="$attrs">
    <slot />
  </VDivider>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
