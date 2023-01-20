<template>
  <AskAnnaChip class="askaanna-chip-status" small label outlined :color="statusColor">
    <AskAnnaAvatar left>
      <AskAnnaIcon small>{{ statusIcon }}</AskAnnaIcon>
    </AskAnnaAvatar>
    {{ statusValue }}
  </AskAnnaChip>
</template>

<script setup lang="ts">
import { get } from 'lodash'

const props = defineProps({
  status: String,
  value: String
})

const COLORS = {
  queued: 'grey',
  failed: 'error',
  undefined: 'grey',
  finished: 'success',
  running: 'blue lighten-3'
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
<style>
.askaanna-chip-status {
  width: 110px;
}
.askaanna-chip-status.v-chip:before {
  background-color: initial;
}
</style>
