<template>
  <v-card class="mx-auto" flat>
    <job-runs
      :items="runs"
      :height="calcSubHeight"
      :tableClass="'job-sub-table'"
      @handleClickOnRow="handleClickOnRow"
    />
  </v-card>
</template>

<script>
import JobRuns from '@jobrun/components/JobRuns'
import useJobStore from '@job/composition/useJobStore'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import { onBeforeMount, defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  components: {
    JobRuns
  },

  setup(rops, context) {
    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()

    onBeforeMount(() => {
      jobStore.resetStore()
      const { jobId } = context.root.$route.params

      jobStore.getJob(jobId)
      jobRunStore.getRunsJob(jobId)
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
      ...jobStore,
      ...jobRunStore,
      calcSubHeight,
      handleClickOnRow
    }
  }
})
</script>
