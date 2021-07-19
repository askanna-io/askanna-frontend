<template>
  <job-run-log />
</template>

<script>
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import { defineComponent, onBeforeMount } from '@vue/composition-api'
import JobRunLog from '@/features/jobrun/components/jobrun/JobRunLog'

export default defineComponent({
  components: { JobRunLog },

  setup(_, context) {
    const jobRunStore = useJobRunStore()

    const fetchData = async () => {
      const { jobRunId } = context.root.$route.params

      if (jobRunStore.jobRun.value.short_uuid !== jobRunId) {
        await jobRunStore.resetStore()
        await jobRunStore.getJobRun(jobRunId)
      }
    }

    onBeforeMount(() => fetchData())
  }
})
</script>
