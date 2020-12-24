<template>
  <v-container class="ma-0 ml-1" fluid>
    <v-row>
      <v-col cols="6" class="pt-0">
        <ask-anna-code
          :code="code"
          :title="'JSON data'"
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
      <v-col cols="12" sm="6">
        <p>
          You have successfully started the job run. The current status is:
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
import useMoment from '@/core/composition/useMoment'
import useJobStore from '@job/composition/useJobStore'
import AskAnnaCode from '@/core/components/shared/AskAnnaCode'
import { ref, computed, onUnmounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'JobRunPlatform',

  components: {
    AskAnnaCode
  },

  setup(props, context) {
    const jobStore = useJobStore()
    const moment = useMoment(context)

    jobStore.resetJobRun()

    const code = ref(`{

}`)
    const timer = ref(null)
    const isValid = ref(false)
    const polling = ref(null)
    const startTime = ref(null)

    const { jobId } = context.root.$route.params

    const jobRun = computed(() => jobStore.jobrun.value)
    const jobRunId = computed(() => jobStore.jobrun.value.run_uuid)
    const jobRunStatus = computed(() => jobStore.jobrun.value.status)
    const isFinished = computed(() => jobRunStatus.value === 'failed' || jobRunStatus.value === 'completed')
    const startedTtext = computed(() =>
      isFinished.value
        ? `The duration of the run was ${calculateDuration.value}.`
        : `The run started ${calculateDuration.value} ago.`
    )

    const handleOnInput = value => (code.value = value)

    const handleRunJob = async () => {
      if (code.value && isValid.value) return

      await jobStore.startJob(code.value)
      checkStatus()
      timer.value = setInterval(async () => {
        startTime.value = new Date().getTime()
      }, 1000)
    }

    const handleValidate = async error => (isValid.value = error)

    const hadnleOpenJobRun = () => {
      context.root.$router.push({
        name: 'workspace-project-jobs-job-jobrun',
        params: { ...context.root.$route.params, jobRunId: jobRunId.value }
      })
    }

    const calculateDuration = computed(() => {
      const endTime = isFinished.value ? jobRun.value.updated : startTime.value
      return moment.duratioHumanize(jobRun.value.created, endTime)
    })

    const checkStatus = () => {
      polling.value = setInterval(async () => {
        await jobStore.getJobRunStatus(jobRunId.value)
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
      code,
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
