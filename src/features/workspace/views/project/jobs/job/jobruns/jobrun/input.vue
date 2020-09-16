<template>
  <job-run-input />
</template>

<script>
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import JobRunInput from '@/features/jobrun/components/jobrun/JobRunInput.vue'
import { defineComponent, onBeforeMount } from '@vue/composition-api'

export default defineComponent({
  components: { JobRunInput },

  setup(props, context) {
    const jobRunStore = useJobRunStore()

    onBeforeMount(async () => {
      const { jobId, jobRunId, projectId } = context.root.$route.params

      if (jobRunStore.jobRun.value.short_uuid !== jobRunId) {
        jobRunStore.resetStore()
        await jobRunStore.getJobRun(jobRunId)
        await handleViewPayload()
      }
    })

    const handleViewPayload = async () => {
      const {
        short_uuid,
        payload: { short_uuid: uuid }
      } = jobRunStore.jobRun.value

      if (!jobRunStore.jobRunPayload.value) {
        await jobRunStore.getJobRunPayload({ jobRunShortId: short_uuid, payloadUuid: uuid })
      }
    }
  }
})
</script>
