<template>
  <AskAnnaCard class="d-flex justify-space-between ml-4" flat>
    <AskAnnaCard v-for="(group, index) in variables" :key="index" flat :width="viewConfig.width">
      <AskAnnaRow no-gutters>
        <AskAnnaCol class="mb-4" v-for="(item, index2) in group" :key="`${index}-${index2}`" cols="12">
          <component
            link
            :to="item.to"
            :key="index2"
            :text="item.text"
            :value="item.value"
            :is="item.component"
            :loading="loadingStatus"
          />
        </AskAnnaCol>
      </AskAnnaRow>
    </AskAnnaCard>
  </AskAnnaCard>
</template>
<script setup lang="ts">
import { get } from 'lodash'
import RunInfoEnv from './parts/RunInfoEnv.vue'
import RunInfoJob from './parts/RunInfoJob.vue'
import RunInfoText from './parts/RunInfoText.vue'
import RunInfoStatus from './parts/RunInfoStatus.vue'
import RunInfoAvatar from './parts/RunInfoAvatar.vue'
import RunInfoCopyText from './parts/RunInfoCopyText.vue'
import AskAnnaLinkCopy from '@/components/AskAnnaLinkCopy.vue'

import { Run } from '../types'

const props = defineProps({
  jobId: {
    type: String,
    default: ''
  },
  run: {
    type: Object as () => Run,
    default: () => {}
  },
  jobName: {
    type: String,
    default: ''
  },
  loadingStatus: {
    type: Boolean,
    default: true
  },
  runIdStatus: {
    type: Object,
    default: () => ({
      status: '',
      updated: '',
      duration: ''
    })
  }
})

const moment = useMoment()
const groupArray = useGroupArray()
const context = getCurrentInstance()

const timer: any = ref(null)
const startTime: any = ref(null)

timer.value = setInterval(async () => {
  startTime.value = new Date().getTime()
}, 300)

const triggers = {
  API: 'API',
  CLI: 'CLI',
  WORKER: 'Worker',
  SCHEDULE: 'Schedule',
  WEBUI: 'Web interface',
  'PYTHON-SDK': 'Python SDK'
}

const calculateDuration = computed(() => {
  const status = props.runIdStatus.status.toLowerCase()
  if (status === 'queued' || status === 'pending') return 'Not started'
  return moment.durationHumanizeBySecond(props.run.duration?.toString())
})

const viewConfig = computed(() => {
  const groups = {
    xs: {
      groupBy: 100,
      width: '100%'
    },
    sm: {
      groupBy: 5,
      width: '50%'
    },
    default: {
      groupBy: 3,

      width: '33.3%'
    }
  }

  return groups[context?.proxy.$root.$vuetify.breakpoint.name] || groups.default
})

const variables = computed(() => {
  const allVariables = [
    {
      text: 'Status',
      value: props.runIdStatus.status,
      component: RunInfoStatus,
      visibility: true
    },
    {
      text: 'SUUID',
      value: props.run.suuid,
      component: RunInfoCopyText,
      visibility: true
    },

    {
      text: 'Job',
      value: props.jobName,
      component: RunInfoJob,
      visibility: true
    },
    {
      text: 'Start date',
      value: moment.$moment(props.run.created).format('Do MMMM YYYY, h:mm:ss a'),
      component: RunInfoText,
      visibility: true
    },
    {
      text: 'Duration',
      value: calculateDuration.value,
      component: RunInfoText,
      visibility: true
    },
    {
      text: 'Code: ',
      to: 'workspace-project-code',
      value: props.run.package.suuid,
      component: AskAnnaLinkCopy,
      visibility: true
    },
    {
      text: 'By',
      value: props.run.created_by,
      component: RunInfoAvatar,
      visibility: true
    },
    {
      text: 'Trigger',
      value: get(triggers, `${props.run.trigger}`) || props.run.trigger,
      component: RunInfoText,
      visibility: true
    },
    {
      text: 'Environment',
      value: props.runIdStatus.environment,
      component: RunInfoEnv,
      visibility: true
    }
  ]

  return groupArray(allVariables, viewConfig.value.groupBy)
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
<style>
.variables--wrapper {
  max-height: 150px;
}
</style>
