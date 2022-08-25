<template>
  <v-card flat class="px-3 mt-2 br-none" outlined>
    <ask-anna-loading-progress :type="'table-row'" :loading="jobsStore.loading">
      <v-row align="center" justify="center">
        <v-col cols="12" class="pa-0">
          <jobs-list :jobList="jobsStore.jobs" />
        </v-col>
      </v-row>
    </ask-anna-loading-progress>
  </v-card>
</template>

<script setup lang="ts">
import { onBeforeMount } from '@vue/composition-api'
import { useRunStore } from '@/features/run/useRunStore'
import { useJobsStore } from '@/features/jobs/useJobsStore'
import { useFileStore } from '@/features/file/useFileStore'
import JobsList from '@/features/jobs/components/JobsList.vue'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

const runStore = useRunStore()
const fileStore = useFileStore()
const jobsStore = useJobsStore()
const router = useRouterAskAnna()

const { projectId } = router.route.value.params

const fetchData = async () => {
  fileStore.$reset()

  await runStore.resetStore()
  await jobsStore.$reset()
  await jobsStore.getProjectJobs(projectId)
}

onBeforeMount(() => fetchData())
</script>
