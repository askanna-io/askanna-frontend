<template>
  <RouterView />
</template>

<script setup lang="ts">
const runStore = useRunStore()
const jobStore = useJobStore()
const fileStore = useFileStore()
const { route } = useRouterAskAnna()

const { jobId } = route.params

const fetchData = async () => {
  await fileStore.$reset()
  await jobStore.$reset()
  await runStore.$reset()
  await jobStore.getJob(jobId)
}

onBeforeMount(() => fetchData())
</script>
