<template>
  <v-alert text outlined dense :color="statusColor" :icon="statusIcon" :height="32" class="mb-0 askanna-alert">
    Last status: {{ statusValue }} ({{ ago(statusData.finished) }})
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

    const ALERT_COLORS = reactive({
      SUCCESS: 'success',
      FAILURE: 'error',
      UNDIFENED: 'grey',
      PENDING: 'yellow darken-2',
      SUBMITTED: 'amber lighten-1'
    })
    const ALERT_VALUES = reactive({
      SUCCESS: 'success',
      UNDIFENED: 'undefined',
      FAILURE: 'failure',
      PENDING: 'pending',
      SUBMITTED: 'submitted'
    })

    const ALERT_ICONS = reactive({
      SUCCESS: 'mdi-check-circle',
      UNDIFENED: 'mdi-do-not-disturb',
      FAILURE: 'mdi-alert-decagram-outline',
      PENDING: 'mdi-progress-clock',
      SUBMITTED: 'mdi-progress-check'
    })

    const status = computed(() => (props.statusData.status ? props.statusData.status : 'UNDIFENED'))

    const statusIcon = computed(() => ALERT_ICONS[status.value])
    const statusColor = computed(() => ALERT_COLORS[status.value])
    const statusValue = computed(() => ALERT_VALUES[status.value])

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
