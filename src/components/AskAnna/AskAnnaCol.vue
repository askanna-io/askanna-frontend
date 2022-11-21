<template>
  <VCol v-bind="$attrs" v-on="$listeners">
    <slot />
  </VCol>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
