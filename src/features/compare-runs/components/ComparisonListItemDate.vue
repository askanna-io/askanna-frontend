<template>
  <AskAnnaTextSlicedCopy :maxLength="28" :value="$moment(value).format(' Do MMMM YYYY, h:mm:ss a')" />
</template>
<script setup lang="ts">
import useMoment from '@/core/composition/useMoment'
import AskAnnaTextSlicedCopy from '@/core/components/shared/AskAnnaTextSlicedCopy.vue'

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

const { $moment } = useMoment()
</script>
