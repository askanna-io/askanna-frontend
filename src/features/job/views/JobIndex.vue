<template>
  <RouterView />
</template>

<script setup lang="ts">
const runStore = useRunStore()
const jobStore = useJobStore()
const fileStore = useFileStore()
const { route } = useRouterAskAnna()

const { jobId } = route.params
const routeParams = computed(() => route.params)

const fetchData = async () => {
  await fileStore.$reset()
  await jobStore.$reset()

  if (route?.name?.includes('job-run-')) return

  await runStore.$reset()
  await jobStore.getJob(jobId)
}

onBeforeMount(() => fetchData())

watch(routeParams, (cr, prev) => {
  if (cr?.jobId && (!jobStore.job.suuid || cr?.jobId !== prev?.jobId)) {
    fetchData()
  }
})
</script>
