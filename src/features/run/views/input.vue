<template>
  <RunInput />
</template>

<script setup lang="ts">
import { useRunStore } from '@/features/run/useRunStore'
import { useFileStore } from '@/features/file/useFileStore'
import RunInput from '@/features/run/components/RunInput.vue'
import { watch, computed, onBeforeMount, onMounted } from '@vue/composition-api'

const runStore = useRunStore()
const fileStore = useFileStore()

const runShortId = computed(() => runStore.run.short_uuid)
const payloadUuid = computed(() => runStore.run.payload?.short_uuid)

const handleViewPayload = async (runShortId, payloadUuid) => {
  if (payloadUuid) {
    await fileStore.getFilePreview({
      extension: 'json',
      serviceName: 'run',
      size: runStore.run.payload.size,
      serviceAction: 'getRunPayload',
      uuid: { runShortId, payloadUuid }
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
