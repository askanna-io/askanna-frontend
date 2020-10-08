<template>
  <job-run-log />
</template>

<script>
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import { defineComponent, onBeforeMount } from '@vue/composition-api'
import JobRunLog from '@/features/jobrun/components/jobrun/JobRunLog'

export default defineComponent({
  components: { JobRunLog },

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
