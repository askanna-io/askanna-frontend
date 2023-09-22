<template>
  <VAlert
    v-bind="$attrs"
    density="compact"
    variant="outlined"
    class="text-center"
  >
    <slot />
  </VAlert>
</template>