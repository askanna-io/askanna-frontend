<template>
  <RunInput />
</template>

<script setup lang="ts">
const runStore = useRunStore()
const fileStore = useFileStore()

const runShortId = computed(() => runStore.run.suuid)
const payloadUuid = computed(() => runStore.run.payload?.suuid)

const handleViewPayload = async (runShortId, payloadUuid) => {
  if (payloadUuid) {
    await fileStore.getFilePreview({
      extension: 'json',
      serviceName: 'run',
      size: runStore.run.payload.size,
      serviceAction: 'getRunPayload',
      suuid: { runShortId, payloadUuid }
    })
  }
}

watch(runShortId, runShortId => {
  if (!payloadUuid.value && runShortId) {
    fileStore.loading = false
  }
})

watch(payloadUuid, (payloadUuid, previusPayloadUuid) => {
  if (fileStore.isFileEmpty || previusPayloadUuid !== payloadUuid) {
    handleViewPayload(runShortId.value, payloadUuid)
  }
})

onBeforeMount(() => {
  fileStore.$reset()

  handleViewPayload(runShortId.value, payloadUuid.value)
})

onMounted(() => {
  if (!payloadUuid.value && runShortId.value) {
    fileStore.loading = false
  }
})
</script>
