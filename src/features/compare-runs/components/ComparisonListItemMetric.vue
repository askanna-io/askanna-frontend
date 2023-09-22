<template>
  <MetricValue
    :fullText="true"
    :metricRow="value.metric"
    :isLabels="value.isLabels"
  />
</template>
<script setup lang="ts">
defineProps({
  value: {
    type: Object,
    default: () => ({
      label: '',
      metric: { name: '', value: '' },
      isLabels: false
    })
  },
  count: {
    type: Number,
    default: 4
  }
})
</script>
