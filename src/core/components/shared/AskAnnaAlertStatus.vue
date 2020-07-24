<template>
  <v-alert text outlined dense :color="statusColor" :icon="statusIcon" :height="32" class="mb-0 askanna-alert">
    Last status: {{ statusValue }} {{ statusData.created && `(${ago(statusData.created)})` }}
  </v-alert>
</template>

<script>
import useMoment from '@/core/composition/useMoment'
import { reactive, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'AskAnnaAlertStatus',

  props: {
    statusData: {
      type: Object,
      default: function () {
        return {
          status: 'UNDIFENED',
          runtime: 0,
          memory: 0,
          return_payload: null,
          stdout: null,
          created: '',
          finished: ''
        }
      }
    }
  },

  setup(props, context) {
    const moment = useMoment(context)

    const COLORS = {
      NOT_RUNS: 'grey',
      SUCCESS: 'success',
      COMPLETED: 'success',
      UNDEFINED: 'grey',
      FAILURE: 'error',
      FAILED: 'error',
      IN_PROGRESS: 'yellow darken-2',
      SUBMITTED: 'amber lighten-1',
      PENDING: 'blue lighten-3'
    }
    const ICONS = {
      NOT_RUNS: 'mdi-do-not-disturb',
      UNDEFINED: 'mdi-do-not-disturb',
      FAILURE: 'mdi-alert-circle-outline',
      FAILED: 'mdi-alert-circle-outline',
      SUCCESS: 'mdi-checkbox-marked-circle',
      COMPLETED: 'mdi-checkbox-marked-circle',
      PENDING: 'mdi-progress-clock',
      SUBMITTED: 'mdi-progress-check',
      IN_PROGRESS: 'mdi-progress-clock'
    }
    const TEXTS = {
      NOT_RUNS: 'No runs yet',
      SUCCESS: 'Succeeded',
      COMPLETED: 'Succeeded',
      UNDEFINED: 'Undefined',
      FAILURE: 'Failure',
      FAILED: 'Failure',
      PENDING: 'Pending',
      SUBMITTED: 'Submitted',
      IN_PROGRESS: 'In progress'
    }

    const status = computed(() => (props.statusData.status ? props.statusData.status : 'UNDIFENED'))

    const statusIcon = computed(() => ICONS[status.value])
    const statusColor = computed(() => COLORS[status.value])
    const statusValue = computed(() => TEXTS[status.value])

    return { statusColor, statusValue, statusIcon, ago: moment.ago }
  }
})
</script>
<style>
.askanna-alert.v-alert {
  width: 360px;
  font-size: 14px;
}
.askanna-alert.v-alert.v-alert--dense {
  padding-top: 3px;
}
.askanna-alert.v-alert--text:before {
  background-color: initial;
}
</style>
