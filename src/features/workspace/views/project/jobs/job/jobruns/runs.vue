<template>
  <v-card class="mx-auto" flat>
    <ask-anna-loading-progress :type="'table-row'" :loading="loading">
      <job-runs
        :items="runs"
        :height="calcSubHeight"
        :tableClass="'job-sub-table'"
        @handleClickOnRow="handleClickOnRow"
      />
    </ask-anna-loading-progress>
  </v-card>
</template>

<script>
import JobRuns from '@jobrun/components/JobRuns'
import useJobStore from '@job/composition/useJobStore'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import { ref, onBeforeMount, defineComponent, computed } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress'

export default defineComponent({
  components: {
    JobRuns,
    AskAnnaLoadingProgress
  },

  setup(rops, context) {
    const loading = ref(true)
    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()

    onBeforeMount(async () => {
      jobStore.resetStore()
      jobRunStore.resetStore()
      const { jobId } = context.root.$route.params

      jobStore.getJob(jobId)
      await jobRunStore.getRunsJob(jobId)

      loading.value = false
    })

    const calcSubHeight = computed(() => {
      const countItems = jobRunStore.runs.length
      const rowHeight = 64
      const subRowHeiht = countItems >= 5 ? 368 : countItems * rowHeight + 70

      return subRowHeiht
    })

    const handleClickOnRow = item => {
      context.root.$router.push({
        name: 'workspace-project-jobs-job-jobrun-input',
        params: { ...context.root.$route.params, jobRunId: item.short_uuid }
      })
    }

    return {
      loading,
      ...jobStore,
      ...jobRunStore,
      calcSubHeight,
      handleClickOnRow
    }
  }
})
</script>
