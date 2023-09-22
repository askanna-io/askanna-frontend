<template>
  <div class="group flex items-center">
    <span class="font-bold">{{ text }}:&nbsp;</span>{{ value }}
  </div>
</template>
<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: true
  },
  value: {
    type: String || Number,
    default: ''
  }
})
</script>
