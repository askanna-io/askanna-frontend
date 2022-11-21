<template>
  <VSubheader v-bind="$attrs" v-on="$listeners">
    <slot />
  </VSubheader>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
