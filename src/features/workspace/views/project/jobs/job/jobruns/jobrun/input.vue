<template>
  <job-run-input />
</template>

<script>
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import JobRunInput from '@/features/jobrun/components/jobrun/JobRunInput.vue'
import { watch, computed, onBeforeMount, defineComponent } from '@vue/composition-api'

export default defineComponent({
  components: { JobRunInput },

  setup(_, context) {
    const { jobRunId } = context.root.$route.params

    const jobRunStore = useJobRunStore()
    const jobRunShortId = computed(() => jobRunStore.jobRun.value.short_uuid)
    const payloadUuid = computed(() => jobRunStore.jobRun.value.payload.short_uuid)

    const handleViewPayload = async (jobRunShortId, payloadUuid) => {
      await jobRunStore.setLoading({ name: 'payLoadLoading', value: true })

      if (payloadUuid) {
        await jobRunStore.getJobRunPayload({ jobRunShortId, payloadUuid })
        await jobRunStore.setLoading({ name: 'payLoadLoading', value: false })
      }
    }

    watch(payloadUuid, (payloadUuid, previusPayloadUuid) => {
      if (!jobRunStore.jobRunPayload.value || previusPayloadUuid !== payloadUuid) {
        handleViewPayload(jobRunShortId.value, payloadUuid)
      }
    })

    onBeforeMount(() => {
      if (jobRunShortId.value !== jobRunId || !jobRunStore.jobRunPayload.value) {
        handleViewPayload(jobRunShortId.value, payloadUuid.value)
      }
    })
  }
})
</script>
