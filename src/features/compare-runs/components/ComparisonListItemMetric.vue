<template>
  <MetricValue :metricRow="value.metric" :fullText="true" :isLabels="value.isLabels" />
</template>
<script setup lang="ts">
import MetricValue from '@/features/metric/components/metric-table/parts/MetricValue.vue'

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
