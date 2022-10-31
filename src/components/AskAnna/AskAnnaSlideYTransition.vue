<template>
  <v-slide-y-transition v-bind="$attrs" v-on="$listeners">
    <slot />
  </v-slide-y-transition>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>
