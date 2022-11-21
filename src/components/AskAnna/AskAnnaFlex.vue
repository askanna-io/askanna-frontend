<template>
  <VFlex v-bind="$attrs">
    <slot />
  </VFlex>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
