<template>
  <VCardText v-bind="$attrs" v-on="$listeners">
    <slot />
  </VCardText>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
