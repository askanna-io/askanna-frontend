<template>
  <AskAnnaContainer class="ma-0 ml-1 pt-0" fluid>
    <AskAnnaRow>
      <AskAnnaCol :cols="$vuetify.breakpoint.xsOnly ? 12 : 5">
        <AskAnnaTextField
          dense
          outlined
          required
          hide-details
          :value="run.name"
          label="Run name (optional)"
          :autofocus="!$vuetify.breakpoint.xsOnly"
          @input="handleOnInput($event, 'name')"
        />
      </AskAnnaCol>
    </AskAnnaRow>
    <AskAnnaRow v-if="!$vuetify.breakpoint.xsOnly" class="pt-3">
      <AskAnnaCol cols="12">
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
      </AskAnnaCol>
    </AskAnnaRow>
    <AskAnnaRow>
      <AskAnnaCol cols="12" class="pt-6">
        <ask-anna-code
          :code="run.code"
          titleWidth="117px"
          :title="'JSON data (optional)'"
          @validete="handleValidate"
          @onInput="handleOnInput($event, 'code')"
        />
      </AskAnnaCol>
    </AskAnnaRow>
    <AskAnnaRow>
      <AskAnnaCol class="pt-0">
        <AskAnnaButton small outlined color="secondary" class="mr-1 btn--hover" @click="handleRunJob">
          <AskAnnaIcon color="secondary" left>mdi-play</AskAnnaIcon>Run this job
        </AskAnnaButton>
      </AskAnnaCol>
    </AskAnnaRow>
    <AskAnnaRow v-if="runStatus">
      <AskAnnaCol cols="12" sm="12">
        <p>
          You have successfully started the run{{ runName }}. The current status is:
          <ask-anna-chip-status :status="runStatus" /><br />{{ startedTtext }}
        </p>

        <AskAnnaButton small outlined color="secondary" class="mr-1 btn--hover" @click="hadnleOpenRun">
          <AskAnnaIcon color="secondary" left>mdi-link</AskAnnaIcon>Open the run
        </AskAnnaButton>
      </AskAnnaCol>
    </AskAnnaRow>
  </AskAnnaContainer>
</template>

<script setup lang="ts">
import { set } from 'lodash'
import { Run } from '@//features/run/types'

const moment = useMoment()
const runStore = useRunStore()
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

const runStatus = computed(() => runStore.newRun.status)
const isFinished = computed(() => runStore.newRun.status === 'failed' || runStore.newRun.status === 'finished')
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

  await runStore.startRun(run.value, jobStore.job.short_uuid)

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
    params: { ...route.params, runId: runStore.newRun.short_uuid }
  })
}

const calculateDuration = computed(() => {
  if (isFinished.value) {
    return moment.durationHumanizeBySecond(runStore.newRun.duration)
  }
  return moment.durationHumanize(runStore.newRun.created, startTime.value)
})

const checkStatus = () => {
  polling.value = setInterval(async () => {
    await runStore.getRunStatus(runStore.newRun.short_uuid, true)
    if (isFinished.value) {
      clearInterval(timer.value)
      clearInterval(polling.value)
    }
  }, 5000)
}

onUnmounted(() => {
  clearInterval(timer.value)
  clearInterval(polling.value)
  runStore.newRun = {} as Run
})
</script>
