<template>
  <AskAnnaTextSlicedCopy :maxLength="28" :value="dayjs(value).format(' Do MMMM YYYY, h:mm:ss a')" />
</template>
<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  }
})

const { dayjs } = useDayjs()
</script>
