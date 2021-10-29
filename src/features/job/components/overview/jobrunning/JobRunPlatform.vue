<template>
  <v-container class="ma-0 ml-1 pt-0" fluid>
    <v-row>
      <v-col cols="5">
        <v-text-field
          dense
          autofocus
          outlined
          required
          :value="run.name"
          label="Run name (optional)"
          @input="handleOnInput($event, 'name')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pt-0">
        <ask-anna-description
          cleared
          outlined
          :title="'Run description (optional)'"
          @onChangeDescription="handleOnInput($event, 'description')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="pt-6">
        <ask-anna-code
          :code="run.code"
          titleWidth="117px"
          :title="'JSON data (optional)'"
          @validete="handleValidate"
          @onInput="handleOnInput($event, 'code')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="handleRunJob">
          <v-icon color="secondary" left>mdi-play</v-icon>Run this job
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="jobRunStatus">
      <v-col cols="12" sm="12">
        <p>
          You have successfully started the run{{ runName }}. The current status is:
          <ask-anna-chip-status :status="jobRunStatus" /><br />{{ startedTtext }}
        </p>

        <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="hadnleOpenJobRun">
          <v-icon color="secondary" left>mdi-link</v-icon>Open the run
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { set } from 'lodash'
import useMoment from '@/core/composition/useMoment'
import useJobStore from '@job/composition/useJobStore'
import AskAnnaCode from '@/core/components/shared/AskAnnaCode'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { ref, computed, onUnmounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunPlatform',

  components: {
    AskAnnaCode
  },

  setup(_, context) {
    const jobStore = useJobStore()
    const moment = useMoment(context)
    const router = useRouterAskAnna()

    jobStore.resetJobRun()

    const run = ref({
      code: '',
      name: '',
      description: ''
    })
    const timer = ref(null)
    const runName = ref(null)
    const polling = ref(null)
    const isValid = ref(false)
    const startTime = ref(null)

    const jobRun = computed(() => jobStore.jobrun.value)
    const jobRunId = computed(() => jobStore.jobrun.value.short_uuid)
    const jobRunStatus = computed(() => jobStore.jobrun.value.status)
    const isFinished = computed(() => jobRunStatus.value === 'failed' || jobRunStatus.value === 'finished')
    const startedTtext = computed(() =>
      isFinished.value
        ? `The duration of the run was ${calculateDuration.value}.`
        : `The run started ${calculateDuration.value} ago.`
    )

    const handleOnInput = (value, path) => set(run.value, path, value)

    const handleRunJob = async () => {
      if (run.value.code && isValid.value) return

      runName.value = run.value.name ? ` "${run.value.name}"` : ''

      await jobStore.startJob({ ...run.value })
      checkStatus()
      timer.value = setInterval(async () => {
        startTime.value = new Date().getTime()
      }, 1000)
    }

    const handleValidate = async error => (isValid.value = error)

    const hadnleOpenJobRun = () => {
      router.push({
        name: 'workspace-project-jobs-job-jobrun',
        params: { ...context.root.$route.params, jobRunId: jobRunId.value }
      })
    }

    const calculateDuration = computed(() => {
      if (isFinished.value) {
        return moment.durationHumanizeBySecond(jobRun.value.duration)
      }
      return moment.durationHumanize(jobRun.value.created, startTime.value)
    })

    const checkStatus = () => {
      polling.value = setInterval(async () => {
        await jobStore.getJobRunStatus()
        if (isFinished.value) {
          clearInterval(timer.value)
          clearInterval(polling.value)
        }
      }, 5000)
    }

    onUnmounted(() => {
      clearInterval(timer.value)
      clearInterval(polling.value)
    })

    return {
      run,
      runName,
      startedTtext,
      jobRunStatus,
      handleRunJob,
      handleOnInput,
      handleValidate,
      hadnleOpenJobRun,
      calculateDuration
    }
  }
})
</script>
