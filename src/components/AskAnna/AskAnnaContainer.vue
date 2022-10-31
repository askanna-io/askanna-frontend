<template>
  <v-container v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-container>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
