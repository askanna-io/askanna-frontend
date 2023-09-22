<template>
  <VTooltip
    v-bind="$attrs"
    location="top"
    activator="parent"
    content-class="bg-secondary/100"
  >
    <template
      v-for="(_, slot) in $slots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>
  </VTooltip>
</template>