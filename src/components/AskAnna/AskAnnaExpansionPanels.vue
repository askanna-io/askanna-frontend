<template>
  <VExpansionPanels v-bind="$attrs">
    <slot />
  </VExpansionPanels>
</template>

<style>
.v-expansion-panels .v-expansion-panel-title__overlay,
.v-expansion-panel-title:hover>.v-expansion-panel-title__overlay {
  opacity: 0;
}
</style>