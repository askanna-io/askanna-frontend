<template>
  <VAlert v-bind="$attrs" v-on="$listeners">
    <slot />
  </VAlert>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
