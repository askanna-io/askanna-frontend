<template>
  <VChip v-bind="$attrs">
    <template
      v-for="(_, slot) in $slots"
      #[slot]
    >
      <slot :name="slot" />
    </template>
  </VChip>
</template>