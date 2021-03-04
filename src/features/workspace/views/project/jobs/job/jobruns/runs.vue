<template>
  <v-card class="mx-auto" flat>
    <ask-anna-loading-progress :type="'table-row'" :loading="loading">
      <job-runs
        :items="runs"
        :count="count"
        :loading="jobRunsLoading"
        :tableClass="'job-sub-table'"
        @onChangeParams="handleChangeParams"
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
    const { jobId: uuid } = context.root.$route.params

    const loading = ref(true)
    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()

    onBeforeMount(async () => {
      jobStore.resetStore()
      jobRunStore.resetStore()

      jobStore.getJob(uuid)
      await jobRunStore.getRunsJob({
        uuid,
        params: {
          limit: 5,
          offset: 0
        }
      })

      loading.value = false
    })

    const runs = computed(() => jobRunStore.runs.value.results)
    const count = computed(() => jobRunStore.runs.value.count)

    const jobRunsLoading = computed(() => jobRunStore.jobRunsLoading.value)

    const handleChangeParams = async params => {
      await jobRunStore.getRunsJob({
        uuid,
        params
      })
    }

    return {
      runs,
      count,
      loading,
      jobRunsLoading,
      handleChangeParams
    }
  }
})
</script>
