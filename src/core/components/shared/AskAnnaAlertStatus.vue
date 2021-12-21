<template>
  <v-alert
    :width="'auto'"
    text
    outlined
    dense
    :color="statusColor"
    :icon="statusIcon"
    :height="32"
    class="mb-0 askanna-alert"
    :class="{ 'px-1': $vuetify.breakpoint.xsOnly }"
  >
    {{ getText($vuetify.breakpoint.xsOnly) }}
  </v-alert>
</template>

<script setup lang="ts">
import { computed } from '@vue/composition-api'
import useMoment from '@/core/composition/useMoment'
import useCapitalize from '@/core/composition/useCapitalize'

const props = defineProps({
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
})

const moment = useMoment()
const capitalize = useCapitalize()

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

const status = computed(() => (props.statusData.status ? props.statusData.status : 'UNDEFINED'))

const statusIcon = computed(() => ICONS[status.value])
const statusColor = computed(() => COLORS[status.value])
const statusValue = computed(() => TEXTS[status.value])

const getText = isMobile => {
  const created = props.statusData.created && `(${moment.ago(props.statusData.created)})`
  const desktopStatus = `Last status: ${statusValue.value} ${created}`
  const mobileStatus = !props.statusData.created
    ? capitalize(statusValue.value)
    : capitalize(moment.ago(props.statusData.created))

  return isMobile ? mobileStatus : desktopStatus
}
</script>
<style lang="scss">
.askanna-alert.v-alert {
  max-width: 360px;
  font-size: 14px;
}
.askanna-alert.v-alert.v-alert--dense {
  padding-top: 3px;
}
.askanna-alert.v-alert--text:before {
  background-color: initial;
}
.mobile-view {
  .askanna-alert {
    .v-alert__content {
      white-space: nowrap;
    }
  }
  .askanna-alert.v-alert .v-icon {
    margin-right: 5px;
  }
}
</style>
