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

<script lang="ts">
import useJobStore from '@/features/job/composition/useJobStore'
import JobRunInfo from '@/features/jobrun/components/jobrun/JobRunInfo'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import AskAnnaDescription from '@/core/components/shared/AskAnnaDescription.vue'

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

    const jobRun = computed(() => jobRunStore.state.jobRun.value)
    const loading = computed(() => jobRunStore.state.jobRunLoading.value)

    const description = computed(() => jobRunStore.state.jobRun.value.description)
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
