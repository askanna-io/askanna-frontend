<template>
  <span class="whitespace-nowrap">
    <span v-if="isShowName">{{ metricRow.name }}:&nbsp;</span>{{ timeFormated }}</span>
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

const dayjs = useDayjs()
// format time to next format
// h:m:s
//  dayjs.dayjs(Date.parse(props.metricRow.value)).format(' Do MMMM YYYY, h:mm:ss a')
//2174-11-21T14:32:59
const timeFormated = computed(() => {
  const timeUtc = dayjs.dayjs.utc(`1987-08-30T${props.metricRow.value}`)
  const localTime = dayjs.dayjs(timeUtc).local(true)

  return localTime.format('h:mm:ss a')
})
</script>
