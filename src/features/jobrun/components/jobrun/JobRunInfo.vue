<template>
  <div>
    <div :class="`d-flex align-start flex-column flex-wrap variables--wrapper`">
      <div v-for="(item, index) in variables" :key="index" class="mx-4 my-2">
        <component :key="index" :text="item.text" :value="item.value" :is="item.component" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { get } from 'lodash'
import useMoment from '@/core/composition/useMoment'
import JobRunInfoJob from './parts/JobRunInfoJob.vue'
import JobRunInfoCode from './parts/JobRunInfoCode.vue'
import JobRunInfoText from './parts/JobRunInfoText.vue'
import JobRunInfoStatus from './parts/JobRunInfoStatus.vue'
import JobRunInfoAvatar from './parts/JobRunInfoAvatar.vue'
import JobRunInfoPackage from './parts/JobRunInfoPackage.vue'
import JobRunInfoCopyText from './parts/JobRunInfoCopyText.vue'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

import { JobRun, JobRunModel } from '../../store/types'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfo',

  components: {
    JobRunInfoJob,
    JobRunInfoText,
    JobRunInfoCode,
    JobRunInfoStatus,
    JobRunInfoAvatar,
    JobRunInfoPackage,
    JobRunInfoCopyText
  },

  props: {
    jobId: {
      type: String,
      default: ''
    },
    jobRun: {
      type: Object as () => JobRun,
      default: new JobRunModel().state
    },
    jobName: {
      type: String,
      default: ''
    }
  },

  setup(props, context) {
    const moment = useMoment(context)
    const router = useRouterAskAnna(context)

    const triggers = {
      API: 'API',
      CLI: 'CLI',
      WORKER: 'Worker',
      SCHEDULE: 'Schedule',
      WEBUI: 'Web interface',
      'PYTHON-SDK': 'Python SDK'
    }

    const variables = computed(() => {
      const allVariables = [
        {
          text: 'Status',
          value: props.jobRun.status,
          component: 'JobRunInfoStatus',
          visibility: true
        },
        {
          text: 'SUUID',
          value: props.jobRun.short_uuid,
          component: 'JobRunInfoCopyText',
          visibility: true
        },

        {
          text: 'Job',
          value: props.jobName,
          component: 'JobRunInfoJob',
          visibility: true
        },
        {
          text: 'Start date',
          value: moment.$moment(props.jobRun.created).format(' Do MMMM YYYY, h:mm:ss a'),
          component: 'JobRunInfoText',
          visibility: true
        },
        {
          text: 'Duration',
          value: calculateDuration(props.jobRun),
          component: 'JobRunInfoText',
          visibility: true
        },
        {
          text: 'Code',
          value: props.jobRun.package.short_uuid,
          component: 'JobRunInfoPackage',
          visibility: true
        },
        {
          text: 'By',
          value: props.jobRun.owner,
          component: 'JobRunInfoAvatar',
          visibility: true
        },
        {
          text: 'Trigger',
          value: get(triggers, `${props.jobRun.trigger}`) || props.jobRun.trigger,
          component: 'JobRunInfoText',
          visibility: true
        },
        {
          text: 'Environment',
          value: props.jobRun.runner.name,
          component: 'JobRunInfoText',
          visibility: true
        },
        {
          text: props.jobRun.runner.cpu_cores > 1 ? 'CPUs' : 'CPU',
          value: props.jobRun.runner.cpu_cores,
          component: 'JobRunInfoText',
          visibility: false
        }
      ]
      interface VariableItem {
        text: string
        value: string | number | object
        component: string
        visibility: boolean
      }

      return allVariables.filter((item: VariableItem) => item.visibility && item.value)
    })

    const handleGotoJob = () => {
      router.push({
        name: 'workspace-project-job-overiew',
        params: { ...context.root.$route.params }
      })
    }

    const calcCPUTime = (time: number) => {
      let elapsed_runtime = moment.$moment.duration(time, 'seconds')
      let display_time = moment.$moment.utc(elapsed_runtime.asMilliseconds()).format('HH:mm:ss')

      return display_time
    }

    const calculateDuration = (item: any) => {
      const currentTime = new Date().toTimeString()
      if (['PENDING', 'IN_PROGRESS', 'SUBMITTED'].indexOf(item.status) !== -1) {
        return moment.durationHumanize(item.created, moment.$moment().toString())
      }

      if (['COMPLETED', 'SUCCESS', 'FAILURE', 'FAILED'].indexOf(item.status) !== -1) {
        return moment.durationHumanize(item.created, item.modified)
      }

      return ''
    }

    return {
      variables,
      handleGotoJob
    }
  }
})
</script>
<style>
.variables--wrapper {
  max-height: 150px;
}
</style>
