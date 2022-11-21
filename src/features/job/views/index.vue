<template>
  <RouterView />
</template>

<script setup lang="ts">
const runStore = useRunStore()
const jobStore = useJobStore()
const fileStore = useFileStore()

const { route } = useRouterAskAnna()

const { jobId } = route.params

onBeforeMount(() => {
  const fetchData = async () => {
    await fileStore.$reset()
    await jobStore.$reset()
    await runStore.resetStore()
    await jobStore.getJob(jobId)
  }

  fetchData()
})
</script>
