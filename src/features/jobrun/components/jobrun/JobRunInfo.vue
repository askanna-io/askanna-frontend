<template>
  <div>
    <div :class="`d-flex align-start flex-column flex-wrap variables--wrapper`">
      <div v-for="(item, index) in variables" :key="index" class="ma-4">
        <component :key="index" :text="item.text" :value="item.value" :is="item.component" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import JobRunInfoJob from './parts/JobRunInfoJob.vue'
import JobRunInfoCode from './parts/JobRunInfoCode.vue'
import JobRunInfoText from './parts/JobRunInfoText.vue'
import JobRunInfoStatus from './parts/JobRunInfoStatus.vue'
import JobRunInfoPackage from './parts/JobRunInfoPackage.vue'
import useMoment from '@/core/composition/useMoment'

import { JobRun, JobRunModel } from '../../store/types'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfo',

  components: {
    JobRunInfoJob,
    JobRunInfoText,
    JobRunInfoCode,
    JobRunInfoStatus,
    JobRunInfoPackage
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

    const variables = computed(() => {
      const allVariables = [
        {
          text: 'Status',
          value: props.jobRun.status,
          component: 'JobRunInfoStatus'
        },
        {
          text: 'Job',
          value: props.jobName,
          component: 'JobRunInfoJob'
        },
        {
          text: 'Code',
          value: props.jobRun.package.short_uuid,
          component: 'JobRunInfoPackage'
        },
        {
          text: 'Code',
          value: '',
          component: 'JobRunInfoCode'
        },

        {
          text: 'Date',
          value: moment.$moment(props.jobRun.created).format(' Do MMMM YYYY, h:mm:ss a'),
          component: 'JobRunInfoText'
        },
        {
          text: 'By',
          value: props.jobRun.owner.name,
          component: 'JobRunInfoText'
        },
        {
          text: 'Trigger',
          value: 'API' || props.jobRun.trigger.name,
          component: 'JobRunInfoText'
        },
        {
          text: 'Environment',
          value: props.jobRun.runner.name,
          component: 'JobRunInfoText'
        },
        {
          text: 'Duratation',
          value: '',
          component: 'JobRunInfoText'
        },
        {
          text: props.jobRun.runner.cpu_cores > 1 ? 'CPUs' : 'CPU',
          value: props.jobRun.runner.cpu_cores,
          component: 'JobRunInfoText'
        },
        {
          text: 'CPU time',
          value: calcCPUTime(props.jobRun.runner.cpu_time),
          component: 'JobRunInfoText'
        }
        /*{
          text: 'Memory',
          value: `${props.jobRun.runner.memory_mib} MB`,
          component: 'JobRunInfoText'
        }*/
      ]
      interface VariableItem {
        text: string
        value: string | number
        component: string
      }

      return allVariables.filter((item: VariableItem) => item.value)
    })

    const handleGotoJob = () => {
      context.root.$router.push({
        name: 'workspace-project-job-overiew',
        params: { ...context.root.$route.params }
      })
    }

    const calcCPUTime = (time: number) => {
      let elapsed_runtime = moment.$moment.duration(time, 'seconds')
      let display_time = moment.$moment.utc(elapsed_runtime.asMilliseconds()).format('HH:mm:ss')

      return display_time
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
  max-height: 200px;
}
</style>
