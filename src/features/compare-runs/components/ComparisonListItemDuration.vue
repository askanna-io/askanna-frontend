<template>
  <AskAnnaTextSlicedCopy :value="calculateDuration" />
</template>
<script setup lang="ts">
import { computed } from '@vue/composition-api'
import useMoment from '@/core/composition/useMoment'
import AskAnnaTextSlicedCopy from '@/core/components/shared/AskAnnaTextSlicedCopy.vue'

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
