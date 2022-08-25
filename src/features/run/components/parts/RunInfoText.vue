<template>
  <div>
    <span class="font-weight-bold">{{ text }}:</span>
    &nbsp;{{ value }}
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
    type: String | Number,
    default: ''
  }
})
</script>
