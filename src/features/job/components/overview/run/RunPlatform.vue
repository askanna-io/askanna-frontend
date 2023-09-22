<template>
  <div class="px-4 mb-4">
    <div class="sm:w-1/3 w-full pt-2">
      <AskAnnaTextField
        required
        hide-details
        :model-value="run.name"
        label="Run name (optional)"
        :autofocus="!$vuetify.display.xs"
        @update:modelValue="handleOnInput($event, 'name')"
      />
    </div>
    <div class="pt-6">
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
    </div>
    <div class="pt-6">
      <AskAnnaCode
        :code="run.code"
        titleWidth="117px"
        :title="'JSON data (optional)'"
        @validete="handleValidate"
        @onInput="handleOnInput($event, 'code')"
      />
    </div>
    <AskAnnaButton
      prependIcon="mdi-play"
      @click="handleRunJob"
    >
      Run this job
    </AskAnnaButton>

    <div
      v-if="runStatus"
      class="pt-2"
    >
      <p class="mb-2">
        You have successfully started the run{{ runName }}. The current status is:
        <AskAnnaChipStatus :status="runStatus" /><br />{{ startedTtext }}
      </p>

      <AskAnnaButton
        prependIcon="mdi-link"
        @click="hadnleOpenRun"
      >
        Open the run
      </AskAnnaButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { set } from 'lodash'
import { Run } from '@//features/run/types'

const dayjs = useDayjs()
const runStore = useRunStore()
const jobStore = useJobStore()
const { route, routerPush } = useRouterAskAnna()

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

  await runStore.startRun(run.value, jobStore.job.suuid)

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
  routerPush({
    name: 'workspace-project-jobs-job-run',
    params: { ...route.params, runId: runStore.newRun.suuid }
  })
}

const calculateDuration = computed(() => {
  if (isFinished.value) {
    return dayjs.durationHumanizeBySecond(runStore.newRun.duration)
  }
  return dayjs.durationHumanize(runStore.newRun.created_at, startTime.value)
})

const checkStatus = () => {
  polling.value = setInterval(async () => {
    await runStore.getRunStatus(runStore.newRun.suuid, true)
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
