<template>
  <AskAnnaCard flat class="px-3 mt-2 br-none" outlined>
    <AskAnnaLoadingProgress :loading="jobsStore.loading">
      <AskAnnaRow align="center" justify="center">
        <AskAnnaCol cols="12" class="pa-0"><JobsList /></AskAnnaCol>
      </AskAnnaRow>
    </AskAnnaLoadingProgress>
  </AskAnnaCard>
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
