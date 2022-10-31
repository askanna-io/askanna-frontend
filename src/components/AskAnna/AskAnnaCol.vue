<template>
  <v-col v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-col>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
