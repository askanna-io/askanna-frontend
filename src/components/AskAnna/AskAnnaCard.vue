<template>
  <VCard
    v-bind="$attrs"
    class="text-main"
    :class="{ 'border-third': $attrs.variant === 'outlined' }"
  >
    <slot />
  </VCard>
</template>