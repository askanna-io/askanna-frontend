<template>
  <span>
    <span v-if="isShowName">{{ metricRow.name }}:&nbsp;</span>{{ dateFormated }}</span
  >
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

const { $moment } = useMoment()

// format date to next format
// 11th February 2021
const dateFormated = computed(() => {
  const dateUtc = $moment.utc(props.metricRow.value)
  const localDate = $moment(dateUtc).local()

  return localDate.format('Do MMMM YYYY')
})
</script>
