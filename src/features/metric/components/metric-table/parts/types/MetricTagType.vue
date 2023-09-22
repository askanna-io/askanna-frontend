<template>
  <div class="flex">
    <div v-if="isShowName">{{ metricRow.name }}: &nbsp;</div>
    <AskAnnaIcon
      size="small"
      icon="mdi-record"
    />
  </div>
</template>
<script setup lang="ts">
defineProps({
  isShowName: {
    type: Boolean,
    default: () => false
  },
  metricRow: {
    type: Object,
    default: function () {
      return {
        name: '',
        type: '',
        value: ''
      }
    }
  }
})
</script>
