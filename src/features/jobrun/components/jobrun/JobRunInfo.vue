<template>
  <v-card class="d-flex justify-space-between ml-4" flat>
    <v-card v-for="(group, index) in variables" :key="index" flat :width="viewConfig.width">
      <v-row no-gutters>
        <v-col class="mb-4" v-for="(item, index2) in group" :key="`${index}-${index2}`" cols="12">
          <component
            :key="index2"
            :text="item.text"
            :value="item.value"
            :is="item.component"
            :loading="loadingStatus"
          />
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
    loadingStatus: {
      type: Boolean,
      default: true
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
    const moment = useMoment()
    const groupArray = useGroupArray()
    const router = useRouterAskAnna()

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
      const status = props.jobRunStatus.status.toLowerCase()
      if (status === 'queued' || status === 'pending') return 'Not started'
      return moment.durationHumanizeBySecond(props.jobRun.duration?.toString())
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

      return groups[context.root.$vuetify.breakpoint.name] || groups.default
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
          value: moment.$moment(props.jobRun.created).format('Do MMMM YYYY, h:mm:ss a'),
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
          value: props.jobRunStatus.environment,
          component: 'JobRunInfoEnv',
          visibility: true
        }
      ]

      return groupArray(allVariables, viewConfig.value.groupBy)
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
      viewConfig,
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
