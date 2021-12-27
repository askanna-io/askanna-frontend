<template>
  <v-card class="mx-auto" flat>
    <ask-anna-loading-progress :type="'table-row'" :loading="loading">
      <job-runs
        :items="runs"
        :count="count"
        :itemsPerPage="25"
        :loading="jobRunsLoading"
        :tableClass="'job-sub-table'"
        @onChangeParams="handleChangeParams"
      />
    </ask-anna-loading-progress>
  </v-card>
</template>

<script lang="ts">
import JobRuns from '@/features/jobrun/components/JobRuns.vue'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import { ref, onBeforeMount, defineComponent, computed } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

export default defineComponent({
  components: {
    JobRuns,
    AskAnnaLoadingProgress
  },

  setup(_, context) {
    const { jobId: uuid } = context.root.$route.params

    const loading = ref(true)
    const jobRunStore = useJobRunStore()

    const fetchData = async () => {
      await jobRunStore.actions.getRunsJob({
        uuid,
        params: {
          limit: 25,
          offset: 0
        }
      })

      loading.value = false
    }

    onBeforeMount(() => fetchData())

    const runs = computed(() => jobRunStore.state.runs.value.results)
    const count = computed(() => jobRunStore.state.runs.value.count)

    const jobRunsLoading = computed(() => jobRunStore.state.jobRunsLoading.value)

    const handleChangeParams = async params => {
      await jobRunStore.actions.getRunsJob({
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
