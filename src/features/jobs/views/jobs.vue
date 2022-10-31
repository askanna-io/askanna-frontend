<template>
  <AskAnnaCard flat class="px-3 mt-2 br-none" outlined>
    <AskAnnaLoadingProgress :type="'table-row'" :loading="jobsStore.loading">
      <AskAnnaRow align="center" justify="center">
        <AskAnnaCol cols="12" class="pa-0">
          <jobs-list :jobList="jobsStore.jobs" />
        </AskAnnaCol>
      </AskAnnaRow>
    </AskAnnaLoadingProgress>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const runStore = useRunStore()
const fileStore = useFileStore()
const jobsStore = useJobsStore()
const { route } = useRouterAskAnna()

const { projectId } = route.params

const fetchData = async () => {
  fileStore.$reset()

  await runStore.resetStore()
  await jobsStore.$reset()
  await jobsStore.getProjectJobs(projectId)
}

onBeforeMount(() => fetchData())
</script>
