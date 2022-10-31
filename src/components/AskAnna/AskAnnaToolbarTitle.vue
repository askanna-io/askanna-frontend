<template>
  <v-toolbar-title v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-toolbar-title>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
