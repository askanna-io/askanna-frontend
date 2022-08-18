<template>
  <div class="pb-5" :class="{ 'px-0 ': $vuetify.breakpoint.xsOnly, 'px-4': !$vuetify.breakpoint.xsOnly }">
    <ask-anna-loading-progress :type="'table-row'" :loading="loading" fullWidth>
      <v-card flat>
        <v-card-title :class="{ 'pt-0': $vuetify.breakpoint.xsOnly }">Information:</v-card-title>
        <job-run-info
          :jobId="jobId"
          :jobRun="jobRun"
          :jobName="jobName"
          :jobRunStatus="jobRunStatus"
          :loadingStatus="loadingStatus"
        />
        <template v-if="isDescriptionNotEmpty">
          <v-card-title class="mt-3">Description:</v-card-title>

          <ask-anna-description class="px-2" preview readonly :description="description" />
        </template>
      </v-card>
    </ask-anna-loading-progress>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/composition-api'
import { useJobStore } from '@/features/job/useJobStore'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import JobRunInfo from '@/features/jobrun/components/jobrun/JobRunInfo.vue'
import AskAnnaDescription from '@/core/components/shared/AskAnnaDescription.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

const jobStore = useJobStore()
const jobRunStore = useJobRunStore()
const { route } = useRouterAskAnna()

const { jobId, jobRunId } = route.value.params

const jobName = computed(() => jobStore.job.name)
const jobRunStatus = computed(() => jobStore.run)
const loadingStatus = computed(() => jobStore.runStatusLoading)

const jobRun = computed(() => jobRunStore.state.jobRun.value)
const loading = computed(() => jobRunStore.state.jobRunLoading.value)

const description = computed(() => jobRunStore.state.jobRun.value.description)
const isDescriptionNotEmpty = computed(() => description.value && description.value !== '<p></p>')

const fetchData = async () => {
  await jobStore.getJobRunStatus(jobRunId)
}

fetchData()
</script>
