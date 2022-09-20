<template>
  <v-card flat class="px-3 mt-2 br-none" outlined>
    <AskAnnaLoadingProgress :type="'table-row'" :loading="jobsStore.loading">
      <v-row align="center" justify="center">
        <v-col cols="12" class="pa-0">
          <jobs-list :jobList="jobsStore.jobs" />
        </v-col>
      </v-row>
    </AskAnnaLoadingProgress>
  </v-card>
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
