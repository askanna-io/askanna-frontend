<template>
  <job-run-input />
</template>

<script lang="ts">
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import JobRunInput from '@/features/jobrun/components/jobrun/JobRunInput.vue'
import { watch, computed, onBeforeMount, onMounted, defineComponent } from '@vue/composition-api'

export default defineComponent({
  components: { JobRunInput },

  setup(_, context) {
    const { jobRunId } = context.root.$route.params

    const jobRunStore = useJobRunStore()
    const jobRunShortId = computed(() => jobRunStore.state.jobRun.value.short_uuid)
    const payloadUuid = computed(() => jobRunStore.state.jobRun.value.payload.short_uuid)

    const stopLoading = async () => await jobRunStore.actions.setLoading({ name: 'payLoadLoading', value: false })

    const handleViewPayload = async (jobRunShortId, payloadUuid) => {
      await jobRunStore.actions.setLoading({ name: 'payLoadLoading', value: true })

      if (payloadUuid) {
        await jobRunStore.actions.getJobRunPayload({ jobRunShortId, payloadUuid })
        await stopLoading()
      }
    }

    watch(jobRunShortId, jobRunShortId => {
      if (!payloadUuid.value && jobRunShortId) {
        stopLoading()
      }
    })

    watch(payloadUuid, (payloadUuid, previusPayloadUuid) => {
      if (!jobRunStore.state.jobRunPayload.value || previusPayloadUuid !== payloadUuid) {
        handleViewPayload(jobRunShortId.value, payloadUuid)
      }
    })

    onBeforeMount(() => {
      if (jobRunShortId.value !== jobRunId || !jobRunStore.state.jobRunPayload.value) {
        handleViewPayload(jobRunShortId.value, payloadUuid.value)
      }
    })

    onMounted(() => {
      if (!payloadUuid.value && jobRunShortId.value) {
        stopLoading()
      }
    })
  }
})
</script>
