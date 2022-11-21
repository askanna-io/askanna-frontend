<template>
  <VBtn v-bind="$attrs" v-on="$listeners">
    <slot />
  </VBtn>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
