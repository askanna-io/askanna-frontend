<template>
  <v-alert v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-alert>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
