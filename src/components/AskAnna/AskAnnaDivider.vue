<template>
  <v-divider v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-divider>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
