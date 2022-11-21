<template>
  <AskAnnaAlert
    :width="'auto'"
    text
    dense
    outlined
    :height="32"
    :icon="statusIcon"
    :color="statusColor"
    class="mb-0 askanna-alert"
    :class="{ 'px-1': $vuetify.breakpoint.xsOnly }"
  >
    {{ getText($vuetify.breakpoint.xsOnly) }}
  </AskAnnaAlert>
</template>

<script setup lang="ts">
import { get } from 'lodash'

const props = defineProps({
  statusData: {
    type: Object,
    default: function () {
      return {
        status: 'UNDIFENED',
        created: '',
        finished: '',
        started: '',
        updated: ''
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
  IN_PROGRESS: 'blue lighten-3',
  SUBMITTED: 'grey',
  PENDING: 'grey'
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

const statusIcon = computed(() => get(ICONS, status.value))
const statusColor = computed(() => get(COLORS, status.value))
const statusValue = computed(() => get(TEXTS, status.value))

const getText = (isMobile: boolean) => {
  const lastStatus = props.statusData.finished || props.statusData.started || props.statusData.created
  const lastStatusMoment = lastStatus && `(${moment.ago(lastStatus)})`
  const desktopStatus = `Last status: ${statusValue.value} ${lastStatusMoment}`
  const mobileStatus = !lastStatus ? capitalize(statusValue.value) : capitalize(moment.ago(lastStatus))

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
