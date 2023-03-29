<template>
  <span>
    <span v-if="isShowName">{{ metricRow.name }}:&nbsp;</span>
    {{ datetimeFormated }}</span>
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

const { dayjs } = useDayjs()
// format datetime to next format
// 11th February 2021, 7:20:45 am
const datetimeFormated = computed(() => {
  const dateUtc = dayjs.utc(props.metricRow.value)
  const localDate = dayjs(dateUtc).local()

  return localDate.format('Do MMMM YYYY, h:mm:ss a')
})
</script>
