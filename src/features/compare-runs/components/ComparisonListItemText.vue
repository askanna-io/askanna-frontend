<template>
  <span>{{ value }}</span>
</template>
<script setup lang="ts">
defineProps({
  value: {
    type: [String, Number],
    default: () => ''
  }
})
</script>
