<template>
  <VSpacer v-bind="$attrs" v-on="$listeners">
    <slot />
  </VSpacer>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
