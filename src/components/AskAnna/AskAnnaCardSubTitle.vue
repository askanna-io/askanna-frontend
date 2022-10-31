<template>
  <v-card-subtitle v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-card-subtitle>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
