<template>
  <job-run-result v-if="jobRun.short_uuid" :jobRun="jobRun" />
</template>

<script>
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import JobRunResult from '@/features/jobrun/components/jobrun/JobRunResult'
import { computed, defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  components: { JobRunResult },

  setup(_, context) {
    const jobRunStore = useJobRunStore()
    const jobRun = computed(() => jobRunStore.jobRun.value)

    onBeforeMount(async () => {
      const { jobRunId } = context.root.$route.params

      if (jobRunStore.jobRun.value.short_uuid !== jobRunId) {
        jobRunStore.resetStore()
        jobRunStore.getJobRun(jobRunId)
      }
    })

    return { jobRun }
  }
})
</script>
