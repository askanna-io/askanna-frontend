<template>
  <v-chip class="askaanna-chip-status" small label outlined :color="statusColor">
    <v-avatar left>
      <v-icon small>{{ statusIcon }}</v-icon>
    </v-avatar>
    {{ statusValue }}
  </v-chip>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AskAnnaChipStatus',

  props: {
    status: String
  },

  setup(props) {
    const COLORS = {
      SUCCESS: 'success',
      COMPLETED: 'success',
      UNDEFINED: 'grey',
      FAILURE: 'error',
      FAILED: 'error',
      IN_PROGRESS: 'yellow darken-2',
      RUNNING: 'yellow darken-2',
      SUBMITTED: 'amber lighten-1',
      PENDING: 'blue lighten-3',
      QUEUED: 'blue lighten-3',
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
    const status = computed(() => (props.status ? props.status.toUpperCase() : 'UNDEFINED'))

    const statusIcon = computed(() => ICONS[status.value])
    const statusColor = computed(() => COLORS[status.value])
    const statusValue = computed(() => TEXTS[status.value])

    return { statusColor, statusIcon, statusValue }
  }
})
</script>
<style>
.askaanna-chip-status {
  width: 110px;
}
.askaanna-chip-status.v-chip:before {
  background-color: initial;
}
</style>
