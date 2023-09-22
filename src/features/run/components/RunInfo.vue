<template>
  <div class="flex flex-col sm:flex-row items-start px-4">
    <div
      class="basis-2/4"
      v-for="(group, index) in variables"
      :key="index"
      :width="viewConfig.width"
    >
      <template
        v-for="(item, index2) in group"
        :key="`${index}-${index2}`"
      >
        <Component
          link
          class="h-8"
          :to="item.to"
          :text="item?.text"
          :value="item.value"
          :is="item.component"
          :title="item?.title"
          :copyTitle="item?.copyTitle"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { get } from 'lodash'
import RunInfoEnv from './parts/RunInfoEnv.vue'
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
    default: () => ({})
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
      modified_at: '',
      duration: ''
    })
  }
})
const dayjs = useDayjs()
const display = useDisplay()
const groupArray = useGroupArray()

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
  const status = props.runIdStatus?.status?.toLowerCase()
  if (status === 'queued' || status === 'pending') return 'Not started'
  return dayjs.durationHumanizeBySecond(props.run.duration?.toString())
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

  return groups[toValue(display.name)] || groups.default
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
      title: 'SUUID',
      value: props.run.suuid,
      component: RunInfoCopyText,
      visibility: true,
      copyTitle: 'Copy SUUID'
    },

    {
      text: 'Job: ',
      value: props.jobName || props.jobId,
      to: 'workspace-project-job-overiew',
      component: AskAnnaLinkCopy,
      visibility: true,
      copyTitle: 'Copy job name'
    },
    {
      text: 'Start date',
      value: ` ${dayjs.dayjs(props.run.created_at).format('Do MMMM YYYY, h:mm:ss a')}`,
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
      to: 'workspace-project-jobs-job-run-code',
      value: props.run?.package?.suuid,
      component: AskAnnaLinkCopy,
      visibility: true,
      copyTitle: 'Copy code SUUID'
    },
    {
      text: 'By',
      value: props.run.created_by,
      component: RunInfoAvatar,
      visibility: true
    },
    {
      text: 'Trigger',
      value: ' ' + get(triggers, `${props.run.trigger}`) || props.run.trigger,
      component: RunInfoText,
      visibility: true
    },
    {
      text: 'Environment',
      value: props.runIdStatus.environment,
      component: RunInfoEnv,
      visibility: true,
      copyTitle: 'Copy image name'
    }
  ]

  return groupArray(allVariables, viewConfig.value.groupBy)
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>
