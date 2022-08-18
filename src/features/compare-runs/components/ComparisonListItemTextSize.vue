<template>
  <span>{{ computedValue }}</span>
</template>
<script setup lang="ts">
import { computed } from '@vue/composition-api'
import useSizeHumanize from '@/core/composition/useSizeHumanize'

const props = defineProps({
  value: {
    type: [String, Number],
    default: () => ''
  }
})

const { humanizeSize } = useSizeHumanize()

const computedValue = computed(() => {
  if (props.value === 0) return '0 KB'
  if (!props.value) return ''

  return humanizeSize(props.value)
})
</script>
