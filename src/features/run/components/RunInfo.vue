<template>
  <v-card class="d-flex justify-space-between ml-4" flat>
    <v-card v-for="(group, index) in variables" :key="index" flat :width="viewConfig.width">
      <v-row no-gutters>
        <v-col class="mb-4" v-for="(item, index2) in group" :key="`${index}-${index2}`" cols="12">
          <component
            link
            :to="item.to"
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
import RunInfoEnv from './parts/RunInfoEnv.vue'
import RunInfoJob from './parts/RunInfoJob.vue'
import RunInfoText from './parts/RunInfoText.vue'
import RunInfoStatus from './parts/RunInfoStatus.vue'
import RunInfoAvatar from './parts/RunInfoAvatar.vue'
import RunInfoCopyText from './parts/RunInfoCopyText.vue'
import useGroupArray from '@/core/composition/useGroupArray'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import AskAnnaLinkCopy from '@/core/components/shared/AskAnnaLinkCopy.vue'

import { Run, RunModel } from '../types'
import { ref, computed, onUnmounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'RunInfo',

  components: {
    RunInfoEnv,
    RunInfoJob,
    RunInfoText,
    RunInfoStatus,
    RunInfoAvatar,
    AskAnnaLinkCopy,
    RunInfoCopyText
  },

  props: {
    jobId: {
      type: String,
      default: ''
    },
    run: {
      type: Object as () => Run,
      default: new RunModel().state
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

      return groups[context.root.$vuetify.breakpoint.name] || groups.default
    })

    const variables = computed(() => {
      const allVariables = [
        {
          text: 'Status',
          value: props.runIdStatus.status,
          component: 'RunInfoStatus',
          visibility: true
        },
        {
          text: 'SUUID',
          value: props.run.short_uuid,
          component: 'RunInfoCopyText',
          visibility: true
        },

        {
          text: 'Job',
          value: props.jobName,
          component: 'RunInfoJob',
          visibility: true
        },
        {
          text: 'Start date',
          value: moment.$moment(props.run.created).format('Do MMMM YYYY, h:mm:ss a'),
          component: 'RunInfoText',
          visibility: true
        },
        {
          text: 'Duration',
          value: calculateDuration.value,
          component: 'RunInfoText',
          visibility: true
        },
        {
          text: 'Code: ',
          to: 'workspace-project-job-overiew',
          value: props.run.package.short_uuid,
          component: 'AskAnnaLinkCopy',
          visibility: true
        },
        {
          text: 'By',
          value: props.run.created_by,
          component: 'RunInfoAvatar',
          visibility: true
        },
        {
          text: 'Trigger',
          value: get(triggers, `${props.run.trigger}`) || props.run.trigger,
          component: 'RunInfoText',
          visibility: true
        },
        {
          text: 'Environment',
          value: props.runIdStatus.environment,
          component: 'RunInfoEnv',
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
