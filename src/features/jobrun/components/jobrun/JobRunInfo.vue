<template>
  <v-card class="d-flex justify-space-between ml-4" flat>
    <v-card v-for="(group, index) in variables" :key="index" flat width="33.3%">
      <v-row no-gutters>
        <v-col class="mb-4" v-for="(item, index2) in group" :key="`${index}-${index2}`" cols="12">
          <component :key="index2" :text="item.text" :value="item.value" :is="item.component" />
        </v-col>
      </v-row>
    </v-card>
  </v-card>
</template>
<script lang="ts">
import { get } from 'lodash'
import useMoment from '@/core/composition/useMoment'
import JobRunInfoEnv from './parts/JobRunInfoEnv.vue'
import JobRunInfoJob from './parts/JobRunInfoJob.vue'
import JobRunInfoCode from './parts/JobRunInfoCode.vue'
import JobRunInfoText from './parts/JobRunInfoText.vue'
import JobRunInfoStatus from './parts/JobRunInfoStatus.vue'
import JobRunInfoAvatar from './parts/JobRunInfoAvatar.vue'
import useGroupArray from '@/core/composition/useGroupArray'
import JobRunInfoPackage from './parts/JobRunInfoPackage.vue'
import JobRunInfoCopyText from './parts/JobRunInfoCopyText.vue'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'

import { JobRun, JobRunModel } from '../../store/types'
import { ref, computed, onUnmounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunInfo',

  components: {
    JobRunInfoEnv,
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
    },
    jobRunStatus: {
      type: Object,
      default: () => ({
        status: '',
        updated: '',
        duration: ''
      })
    }
  },

  setup(props, context) {
    const moment = useMoment(context)
    const groupArray = useGroupArray()
    const router = useRouterAskAnna(context)

    const timer: any = ref(null)
    const startTime: any = ref(null)

    timer.value = setInterval(async () => {
      startTime.value = new Date().getTime()
    }, 1000)

    const triggers = {
      API: 'API',
      CLI: 'CLI',
      WORKER: 'Worker',
      SCHEDULE: 'Schedule',
      WEBUI: 'Web interface',
      'PYTHON-SDK': 'Python SDK'
    }

    const isFinished = computed(
      () => props.jobRunStatus.status === 'failed' || props.jobRunStatus.status === 'finished'
    )

    const calculateDuration = computed(() => {
      if (isFinished.value) {
        return moment.durationHumanizeBySecond(props.jobRunStatus.duration?.toString())
      }
      return moment.durationHumanize(props.jobRunStatus.created, startTime.value)
    })

    const variables = computed(() => {
      const allVariables = [
        {
          text: 'Status',
          value: props.jobRunStatus.status,
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
          value: calculateDuration.value,
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
          value: props.jobRun.environment,
          component: 'JobRunInfoEnv',
          visibility: true
        }
      ]
      interface VariableItem {
        text: string
        value: string | number | object
        component: string
        visibility: boolean
      }

      return groupArray(
        allVariables.filter((item: VariableItem) => item.visibility && item.value),
        3
      )
    })

    const handleGotoJob = () => {
      router.push({
        name: 'workspace-project-job-overiew',
        params: { ...context.root.$route.params }
      })
    }

    onUnmounted(() => {
      clearInterval(timer.value)
    })

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
