<template>
  <td class="text-left" :key="label" :style="labelStyles">
    <metric-value :metricRow="labelValue" :isLabels="isLabels" :isLabel="isLabel" />
  </td>
</template>
<script setup lang="ts">
import MetricValue from './MetricValue.vue'
import { computed } from '@vue/composition-api'

const props = defineProps({
  isLabel: {
    type: Boolean,
    default: () => false
  },
  labels: Array,
  label: String,
  isLabels: Boolean
})

const types = {
  tag: {},
  date: { minWidth: '160px' },
  time: { minWidth: '110px' },
  float: {},
  string: { minWidth: '190px' },
  boolean: { minWidth: '95px' },
  integer: {},
  datetime: { minWidth: '240px' },
  dictionary: { minWidth: '190px' }
}

const labelValue = computed(() => {
  const value = props.labels.find(item => item.name === props.label)

  return { ...value }
})

const labelStyles = computed(() => {
  return types[labelValue.value.type]
})
</script>
