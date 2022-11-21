<template>
  <VRow v-bind="$attrs" v-on="$listeners">
    <slot />
  </VRow>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
