<template>
  <v-chip class="ma-2 askaanna-chip-status" small label outlined :color="statusColor">
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
      UNDIFENED: 'grey',
      FAILURE: 'error',
      PENDING: 'yellow darken-2',
      SUBMITTED: 'amber lighten-1'
    }
    const ICONS = {
      UNDIFENED: 'mdi-do-not-disturb',
      FAILURE: 'mdi-alert-decagram-outline',
      SUCCESS: 'mdi-checkbox-marked-circle',
      COMPLETED: 'mdi-checkbox-marked-circle',
      PENDING: 'mdi-progress-clock',
      SUBMITTED: 'mdi-progress-check'
    }
    const status = computed(() => (props.status ? props.status : 'UNDIFENED'))

    const statusIcon = computed(() => ICONS[status.value])
    const statusColor = computed(() => COLORS[status.value])

    return { statusColor, statusIcon, statusValue: status }
  }
})
</script>
<style>
.askaanna-chip-status.v-chip:before {
  background-color: initial;
}
</style>
