<template>
  <v-container class="ma-0 ml-1 pt-0" fluid>
    <v-row>
      <v-col :cols="$vuetify.breakpoint.xsOnly ? 12 : 5">
        <v-text-field
          dense
          outlined
          required
          hide-details
          :value="run.name"
          label="Run name (optional)"
          :autofocus="!$vuetify.breakpoint.xsOnly"
          @input="handleOnInput($event, 'name')"
        />
      </v-col>
    </v-row>
    <v-row v-if="!$vuetify.breakpoint.xsOnly" class="pt-3">
      <v-col cols="12">
        <AskAnnaDescription
          cleared
          outlined
          ref="Editor"
          hide-details
          isClearContent
          :headerHeight="440"
          :description="run.description"
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
    <v-row v-if="runStatus">
      <v-col cols="12" sm="12">
        <p>
          You have successfully started the run{{ runName }}. The current status is:
          <ask-anna-chip-status :status="runStatus" /><br />{{ startedTtext }}
        </p>

        <v-btn small outlined color="secondary" class="mr-1 btn--hover" @click="hadnleOpenRun">
          <v-icon color="secondary" left>mdi-link</v-icon>Open the run
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { set } from 'lodash'
import { Run } from '@//features/run/types'

const moment = useMoment()
const jobStore = useJobStore()
const { route, router } = useRouterAskAnna()

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

const runStatus = computed(() => jobStore.newRun.status)
const isFinished = computed(() => jobStore.newRun.status === 'failed' || jobStore.newRun.status === 'finished')
const startedTtext = computed(() =>
  isFinished.value
    ? `The duration of the run was ${calculateDuration.value}.`
    : `The run started ${calculateDuration.value} ago.`
)

const handleOnInput = (value, path) => set(run.value, path, value)

const handleRunJob = async () => {
  const isCodeEmpty = run.value.code === ''

  if (!isCodeEmpty && !isValid.value) return

  run.value.code = isCodeEmpty ? undefined : run.value.code

  runName.value = run.value.name ? ` "${run.value.name}"` : ''

  await jobStore.startJob(run.value)

  clearInterval(timer.value)
  clearInterval(polling.value)
  checkStatus()

  timer.value = setInterval(async () => {
    startTime.value = new Date().getTime()
  }, 1000)

  run.value = {
    code: '',
    name: '',
    description: ''
  }
}

const handleValidate = async (value: boolean) => (isValid.value = value)

const hadnleOpenRun = () => {
  router.push({
    name: 'workspace-project-jobs-job-run',
    params: { ...route.params, runId: jobStore.newRun.short_uuid }
  })
}

const calculateDuration = computed(() => {
  if (isFinished.value) {
    return moment.durationHumanizeBySecond(jobStore.newRun.duration)
  }
  return moment.durationHumanize(jobStore.newRun.created, startTime.value)
})

const checkStatus = () => {
  polling.value = setInterval(async () => {
    await jobStore.getRunStatus(jobStore.newRun.short_uuid, true)
    if (isFinished.value) {
      clearInterval(timer.value)
      clearInterval(polling.value)
    }
  }, 5000)
}

onUnmounted(() => {
  clearInterval(timer.value)
  clearInterval(polling.value)
  jobStore.newRun = {} as Run
})
</script>
