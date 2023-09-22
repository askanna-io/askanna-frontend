<template>
  <span>
    <span v-if="isShowName">{{ metricRow.name }}:&nbsp;</span>
    <AskAnnaIcon
      :icon="icon"
      size="small"
    />
  </span>
</template>
<script setup lang="ts">
const props = defineProps({
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

const icon = computed(() => {
  let icon = 'mdi-close'

  if (props.metricRow.value === 'null') {
    icon = 'mdi-record'
  }
  if (props.metricRow.value === true) {
    icon = 'mdi-check'
  }

  return icon
})
</script>
