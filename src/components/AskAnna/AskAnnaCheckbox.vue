<template>
  <VCheckbox
    class="h-18"
    v-bind="$attrs"
    color="primary"
    density="compact"
  >
    <template
      v-for="(_, slot) in $slots"
      #[slot]
    >
      <slot :name="slot" />
    </template>
  </VCheckbox>
</template>
<style>
.v-checkbox .v-input__details {
  padding-top: 0;
  padding-left: 16px;
  min-height: auto;
}

.v-checkbox label {
  opacity: 1;

}
</style>