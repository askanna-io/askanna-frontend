<template>
  <v-spacer v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-spacer>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
