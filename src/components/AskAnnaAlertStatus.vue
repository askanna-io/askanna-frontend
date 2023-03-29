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
    {{ getText($vuetify.breakpoint.smAndDown) }}
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
        created_at: '',
        finished_at: '',
        started_at: '',
        updated_at: ''
      }
    }
  }
})

const dayjs = useDayjs()
const capitalize = useCapitalize()

const COLORS = {
  queued: 'grey',
  failed: 'error',
  not_runs: 'grey',
  undefined: 'grey',
  finished: 'success',
  running: 'blue lighten-3'
}
const ICONS = {
  not_runs: 'mdi-do-not-disturb',
  undefined: 'mdi-do-not-disturb',
  failed: 'mdi-alert-circle-outline',
  running: 'mdi-progress-clock',
  finished: 'mdi-checkbox-marked-circle',
  queued: 'mdi-progress-clock'
}
const TEXTS = {
  not_runs: 'No runs yet',
  finished: 'Succeeded',
  undefined: 'Undefined',
  failed: 'Failure',
  queued: 'Pending',
  running: 'In progress'
}

const status = computed(() => (props.statusData.status ? props.statusData.status : 'undefined'))

const statusIcon = computed(() => get(ICONS, status.value))
const statusColor = computed(() => get(COLORS, status.value))
const statusValue = computed(() => get(TEXTS, status.value))

const getText = (isMobile: boolean) => {
  const lastStatus = props.statusData.finished_at || props.statusData.started_at || props.statusData.created_at
  const lastStatusDayJS = lastStatus && `(${dayjs.ago(lastStatus)})`
  const desktopStatus = `Last status: ${statusValue.value} ${lastStatusDayJS}`
  const mobileStatus = !lastStatus ? capitalize(statusValue.value) : capitalize(dayjs.ago(lastStatus))

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
