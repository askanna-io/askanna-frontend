<template>
  <router-view />
</template>

<script setup lang="ts">
const jobStore = useJobStore()
const runStore = useRunStore()
const jobsStore = useJobsStore()
const { route } = useRouterAskAnna()

const { isSet, setIntervalFn, clearIntervalFn } = useInterval()

const runStatus = computed(() => jobStore.run.status)
const isFinished = computed(() => runStatus.value === 'failed' || runStatus.value === 'finished')

const checkStatus = () => {
  if (isSet('checkStatus')) return
  setIntervalFn('checkStatus', async () => {
    const { runId } = route.params

    await jobStore.getRunStatus(runId)
    if (isFinished.value) {
      await runStore.getRun(runId)
      clearIntervalFn('checkStatus')
    }
  })
}

const fetchData = async () => {
  const { jobId, projectId, runId } = route.params

  if (jobStore.job.short_uuid !== jobId) {
    await jobsStore.$reset()
    await jobsStore.getProjectJobs(projectId)

    await jobStore.getJob(jobId)
  }
  await runStore.getRun(runId)
  await jobStore.getRunStatus(runId)
}

onBeforeMount(() => {
  fetchData()
})

watchEffect(() => {
  if (runStatus.value && !isFinished.value) {
    checkStatus()
  }
})
</script>
