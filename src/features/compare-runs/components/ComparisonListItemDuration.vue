<template>
  <AskAnnaTextSlicedCopy :value="calculateDuration" />
</template>
<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  }
})

const { durationHumanizeBySecond } = useMoment()

const calculateDuration = computed(() => {
  if (!props.value) return 'Not started'
  return durationHumanizeBySecond(props.value)
})
</script>
