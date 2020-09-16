<template>
  <job-run-result />
</template>

<script>
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import { defineComponent, onBeforeMount } from '@vue/composition-api'
import JobRunResult from '@/features/jobrun/components/jobrun/JobRunResult'

export default defineComponent({
  components: { JobRunResult },

  setup(props, context) {
    const jobRunStore = useJobRunStore()

    onBeforeMount(async () => {
      const { jobRunId } = context.root.$route.params

      if (jobRunStore.jobRun.value.short_uuid !== jobRunId) {
        jobRunStore.resetStore()
        jobRunStore.getJobRun(jobRunId)
      }
    })
  }
})
</script>
