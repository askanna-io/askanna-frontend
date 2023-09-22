<template>
  <VSelect
    hide-details
    v-bind="$attrs"
    color="primary"
    density="compact"
    item-title="name"
    item-value="value"
    variant="underlined"
    clear-icon="mdi-close"
    :class="{ '[&>div>div>div>div:nth-child(2)]:pt-1': isTweakLabelStyles }"
  >
    <slot />

  </VSelect>
</template>
<script setup>
const props = defineProps({
  isTweakLabelStyles: {
    type: Boolean,
    default: true
  }
})
</script>
<style>
.v-select .v-field__append-inner .v-select__menu-icon {
  margin-left: 0px;
}

.v-select .v-field__clearable {
  margin-right: 0px !important;
}
</style>