<template>
  <v-card-title v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-card-title>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
