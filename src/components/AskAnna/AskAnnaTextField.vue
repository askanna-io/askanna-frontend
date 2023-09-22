<template>
  <VTextField
    v-bind="$attrs"
    color="primary"
    density="compact"
    variant="outlined"
    clear-icon="mdi-close"
    class="[&>div:nth-child(2)]:-mt-1 [&>div>div>input]:bg-none"
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
  </VTextField>
</template>
<style lang="scss">
.clearable {
  .v-field--appended {
    padding-right: 0px;
  }
}

.v-field--variant-outlined {
  background-color: white;

  input {
    background: none;
  }
}
</style>
