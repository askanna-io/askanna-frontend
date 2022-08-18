<template>
  <v-chip class="askaanna-chip-status" small label outlined :color="statusColor">
    <v-avatar left>
      <v-icon small>{{ statusIcon }}</v-icon>
    </v-avatar>
    {{ statusValue }}
  </v-chip>
</template>

<script setup lang="ts">
import { get } from 'lodash'
import { computed } from '@vue/composition-api'

const props = defineProps({
  status: String,
  value: String
})

const COLORS = {
  SUCCESS: 'success',
  COMPLETED: 'success',
  UNDEFINED: 'grey',
  FAILURE: 'error',
  FAILED: 'error',
  IN_PROGRESS: 'blue lighten-3',
  RUNNING: 'blue lighten-3',
  SUBMITTED: 'grey',
  PENDING: 'grey',
  QUEUED: 'grey',
  FINISHED: 'success'
}
const ICONS = {
  UNDEFINED: 'mdi-do-not-disturb',
  FAILURE: 'mdi-alert-circle-outline',
  FAILED: 'mdi-alert-circle-outline',
  SUCCESS: 'mdi-checkbox-marked-circle',
  COMPLETED: 'mdi-checkbox-marked-circle',
  PENDING: 'mdi-progress-clock',
  QUEUED: 'mdi-progress-clock',
  SUBMITTED: 'mdi-progress-check',
  IN_PROGRESS: 'mdi-progress-clock',
  RUNNING: 'mdi-progress-clock',
  FINISHED: 'mdi-checkbox-marked-circle'
}
const TEXTS = {
  SUCCESS: 'Succeeded',
  COMPLETED: 'Succeeded',
  UNDEFINED: 'Undefined',
  FAILURE: 'Failure',
  FAILED: 'Failure',
  PENDING: 'Pending',
  QUEUED: 'Pending',
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'In progress',
  RUNNING: 'In progress',
  FINISHED: 'Finished'
}

const val = computed(() => props.status || props.value)
const status = computed(() => (val.value ? val.value.toUpperCase() : 'UNDEFINED'))

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
