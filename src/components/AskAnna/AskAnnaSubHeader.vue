<template>
  <v-subheader v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-subheader>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
