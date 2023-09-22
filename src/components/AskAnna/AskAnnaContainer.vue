<template>
  <VContainer v-bind="$attrs">
    <slot />
  </VContainer>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
