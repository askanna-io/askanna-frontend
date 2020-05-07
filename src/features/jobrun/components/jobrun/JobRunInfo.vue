<template>
  <div>
    <div :class="`d-flex align-start flex-column flex-wrap`">
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

import { JobRun, JobRunModel } from '../../store/types'
import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfo',

  components: {
    JobRunInfoJob,
    JobRunInfoText,
    JobRunInfoCode,
    JobRunInfoStatus
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
          value: '',
          component: 'JobRunInfoCode'
        },

        {
          text: 'Date',
          value: '',
          component: 'JobRunInfoText'
        },
        {
          text: 'By',
          value: props.jobRun.owner.name,
          component: 'JobRunInfoText'
        },
        {
          text: 'Trigger',
          value: props.jobRun.trigger.name,
          component: 'JobRunInfoText'
        },
        {
          text: 'Environment',
          value: props.jobRun.runner.name,
          component: 'JobRunInfoText'
        },
        {
          text: 'Duratation',
          value: props.jobRun.runtime,
          component: 'JobRunInfoText'
        },
        {
          text: 'CPU',
          value: '',
          component: 'JobRunInfoText'
        },
        {
          text: 'Memory',
          value: props.jobRun.memory,
          component: 'JobRunInfoText'
        }
      ]
      interface VariableItem {
        text: String
        value: String | number
        component: String
      }

      return allVariables.filter((item: VariableItem) => item.value)
    })

    const handleGotoJob = () => {
      context.root.$router.push({
        name: 'workspace-project-job-overiew',
        params: { ...context.root.$route.params }
      })
    }

    return {
      variables,
      handleGotoJob
    }
  }
})
</script>
