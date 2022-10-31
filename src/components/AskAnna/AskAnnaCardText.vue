<template>
  <v-card-text v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-card-text>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
