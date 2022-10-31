<template>
  <v-card-actions v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-card-actions>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
