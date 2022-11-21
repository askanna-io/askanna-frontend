<template>
  <VContainer v-bind="$attrs" v-on="$listeners">
    <slot />
  </VContainer>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
