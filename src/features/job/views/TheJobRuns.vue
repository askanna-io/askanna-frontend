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
import { onBeforeMount, createComponent, computed } from '@vue/composition-api'
import useJobStore from '../composition/useJobStore'
import JobRuns from '@jobrun/components/JobRuns'
import useJobRunStore from '@jobrun/composition/useJobRunStore'

export default createComponent({
  name: 'TheJobRuns',

  components: {
    JobRuns
  },

  setup(rops, context) {
    const jobStore = useJobStore()
    const jobRunStore = useJobRunStore()

    onBeforeMount(() => {
      console.log('ads')
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
        name: 'workspace-project-jobs-name-uuid',
        params: { ...context.root.$route.params, jobRunId: item.uuid, jobId: jobId || 'jobname' }
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
