<template>
  <RouterView />
</template>

<script setup lang="ts">
const runStore = useRunStore()
const fileStore = useFileStore()
const metricStore = useMetricStore()
const { route } = useRouterAskAnna()
const runVariablesStore = useRunVariablesStore()
const { isSet, setIntervalFn, clearIntervalFn } = useAskAnnaInterval()

const runStatus = computed(() => runStore.run.status)
const isFinished = computed(() => FINISHED_STATUSES.includes(runStatus.value?.toLowerCase()))

const checkStatus = () => {
  if (isSet('checkStatus')) return
  setIntervalFn('checkStatus', async () => {
    const { runId } = route.params

    await runStore.getRunStatus(runId)
    if (isFinished.value) {
      await runStore.getRun(runId)
      clearIntervalFn('checkStatus')
    }
  })
}

const fetchData = async () => {
  await runStore.$reset()
  await fileStore.$reset()
  await metricStore.$reset()
  await runVariablesStore.$reset()

  const { runId } = route.params

  await runStore.getRun(runId)
  await metricStore.getMetricMeta()
}

onBeforeMount(() => fetchData())

watchEffect(() => {
  if (runStatus.value && !isFinished.value) {
    checkStatus()
  }
})
</script>
