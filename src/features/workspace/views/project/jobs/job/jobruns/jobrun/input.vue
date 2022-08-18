<template>
  <JobRunInput />
</template>

<script setup lang="ts">
import { useFileStore } from '@/features/file/useFileStore'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import JobRunInput from '@/features/jobrun/components/jobrun/JobRunInput.vue'
import { watch, computed, onBeforeMount, onMounted } from '@vue/composition-api'

const fileStore = useFileStore()
const jobRunStore = useJobRunStore()

const jobRunShortId = computed(() => jobRunStore.state.jobRun.value.short_uuid)
const payloadUuid = computed(() => jobRunStore.state.jobRun.value.payload?.short_uuid)

const handleViewPayload = async (jobRunShortId, payloadUuid) => {
  if (payloadUuid) {
    await fileStore.getFilePreview({
      extension: 'json',
      serviceName: 'jobrun',
      serviceAction: 'getJobRunPayload',
      uuid: { jobRunShortId, payloadUuid },
      size: jobRunStore.state.jobRun.value.payload.size
    })
  }
}

watch(jobRunShortId, jobRunShortId => {
  if (!payloadUuid.value && jobRunShortId) {
    fileStore.loading = false
  }
})

watch(payloadUuid, (payloadUuid, previusPayloadUuid) => {
  if (fileStore.isFileEmpty || previusPayloadUuid !== payloadUuid) {
    handleViewPayload(jobRunShortId.value, payloadUuid)
  }
})

onBeforeMount(() => {
  fileStore.$reset()

  handleViewPayload(jobRunShortId.value, payloadUuid.value)
})

onMounted(() => {
  if (!payloadUuid.value && jobRunShortId.value) {
    fileStore.loading = false
  }
})
</script>
