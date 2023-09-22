<template>
  <button
    type="button"
    v-bind="$attrs"
    class="tracking-wider font-medium py-1 uppercase text-xs hover:text-primary"
  >
    <slot />
  </button>
</template>
