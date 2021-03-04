<template>
  <job-run-input />
</template>

<script>
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import JobRunInput from '@/features/jobrun/components/jobrun/JobRunInput.vue'
import { watch, computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  components: { JobRunInput },

  setup(props, context) {
    const jobRunStore = useJobRunStore()
    const payloadUuid = computed(() => jobRunStore.jobRun.value.payload.short_uuid)

    const handleViewPayload = async payloadUuid => {
      await jobRunStore.setLoading({ name: 'payLoadLoading', value: true })

      if (!payloadUuid) return

      const { short_uuid: jobRunShortId } = jobRunStore.jobRun.value

      if (!jobRunStore.jobRunPayload.value) {
        await jobRunStore.getJobRunPayload({ jobRunShortId, payloadUuid })
      }

      await jobRunStore.setLoading({ name: 'payLoadLoading', value: false })
    }

    watch(payloadUuid, async payloadUuid => {
      await handleViewPayload(payloadUuid)
    })

    handleViewPayload(payloadUuid.value)
  }
})
</script>
