<template>
  <div class="px-4 pb-5">
    <ask-anna-loading-progress :type="'table-row'" :loading="loading" fullWidth>
      <v-card flat>
        <v-card-title>Information:</v-card-title>
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

<script>
import useJobStore from '@job/composition/useJobStore'
import JobRunInfo from '@jobrun/components/jobrun/JobRunInfo'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import AskAnnaDescription from '@/core/components/shared/AskAnnaDescription'

import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  name: 'Overview',

  components: {
    JobRunInfo,
    AskAnnaDescription
  },

  setup(_, context) {
    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()

    const { jobId, jobRunId } = context.root.$route.params

    const jobName = computed(() => jobStore.job.value.name)
    const jobRunStatus = computed(() => jobStore.jobrun.value)
    const loadingStatus = computed(() => jobStore.jobRunStatusLoading.value)

    const jobRun = computed(() => jobRunStore.jobRun.value)
    const loading = computed(() => jobRunStore.jobRunLoading.value)

    const description = computed(() => jobRunStore.jobRun.value.description)
    const isDescriptionNotEmpty = computed(() => description.value && description.value !== '<p></p>')

    const fetchData = async () => {
      await jobStore.getJobRunStatus(jobRunId)
    }

    fetchData()

    return {
      jobId,
      jobRun,
      jobName,
      loading,
      description,
      jobRunStatus,
      loadingStatus,
      isDescriptionNotEmpty
    }
  }
})
</script>
