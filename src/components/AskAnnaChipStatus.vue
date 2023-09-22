<template>
  <AskAnnaChip
    label
    size="small"
    class="w-28"
    :class="{ 'cursor-pointer': link }"
    variant="outlined"
    :color="statusColor"
  >
    <AskAnnaIcon
      start
      size="small"
      :icon="statusIcon"
    />
    {{ statusValue }}
  </AskAnnaChip>
</template>

<script setup lang="ts">
import { get } from 'lodash'

const props = defineProps({
  status: String,
  value: String,
  link: {
    type: Boolean,
    default: false
  }
})

const COLORS = {
  queued: 'grey',
  failed: 'error',
  undefined: 'grey',
  finished: 'success',
  running: 'accent'
}
const ICONS = {
  queued: 'mdi-progress-clock',
  running: 'mdi-progress-clock',
  undefined: 'mdi-do-not-disturb',
  failed: 'mdi-alert-circle-outline',
  finished: 'mdi-checkbox-marked-circle'
}
const TEXTS = {
  queued: 'Pending',
  failed: 'Failure',
  finished: 'Succeeded',
  undefined: 'Undefined',
  running: 'In progress'
}

const val = computed(() => props.status || props.value)
const status = computed(() => val.value || 'undefined')

const statusIcon = computed(() => get(ICONS, status.value))
const statusColor = computed(() => get(COLORS, status.value))
const statusValue = computed(() => get(TEXTS, status.value))
</script>
