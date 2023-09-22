<template>
  <Component
    :is="tag"
    :key="label"
    :style="labelStyles"
    class="text-left bg-transparent h-10 "
  >
    <MetricValue
      :isLabel="isLabel"
      :isLabels="isLabels"
      :metricRow="labelValue"
    />
  </Component>
</template>
<script setup lang="ts">
const props = defineProps({
  isLabel: {
    type: Boolean,
    default: () => false
  },
  tag: {
    type: String,
    default: 'td'
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
