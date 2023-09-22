<template>
  <AskAnnaLoadingProgress :loading="jobsStore.loading">
    <JobsList />
  </AskAnnaLoadingProgress>
</template>

<script setup lang="ts">
const runStore = useRunStore()
const fileStore = useFileStore()
const jobsStore = useJobsStore()

const fetchData = async () => {
  await fileStore.$reset()
  await runStore.$reset()
  await jobsStore.$reset()
}

onBeforeMount(() => fetchData())
</script>
