<template>
  <job-run-input />
</template>

<script>
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import JobRunInput from '@/features/jobrun/components/jobrun/JobRunInput.vue'
import { watch, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  components: { JobRunInput },

  setup() {
    const jobRunStore = useJobRunStore()
    const jobRunShortId = computed(() => jobRunStore.jobRun.value.short_uuid)
    const payloadUuid = computed(() => jobRunStore.jobRun.value.payload.short_uuid)

    const handleViewPayload = async (jobRunShortId, payloadUuid) => {
      await jobRunStore.setLoading({ name: 'payLoadLoading', value: true })

      if (!jobRunShortId) return

      if (!payloadUuid) {
        await jobRunStore.setLoading({ name: 'payLoadLoading', value: false })
        return
      }

      if (!jobRunStore.jobRunPayload.value) {
        await jobRunStore.getJobRunPayload({ jobRunShortId, payloadUuid })
      }
      await jobRunStore.setLoading({ name: 'payLoadLoading', value: false })
    }

    watch(jobRunShortId, jobRunShortId => {
      handleViewPayload(jobRunShortId, payloadUuid.value)
    })
    handleViewPayload(jobRunShortId.value, payloadUuid.value)
  }
})
</script>
