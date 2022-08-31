<template>
  <run-log />
</template>

<script setup lang="ts">
import { useRouter } from '@/core/plugins/vue-hooks'
import { onBeforeMount } from '@vue/composition-api'
import { useRunStore } from '@/features/run/useRunStore'
import { useFileStore } from '@/features/file/useFileStore'
import runLog from '@/features/run/components/RunLog.vue'

const { route } = useRouter()
const runStore = useRunStore()
const fileStore = useFileStore()

const fetchData = async () => {
  fileStore.$reset()

  const { runId } = route.value.params

  if (runStore.run.short_uuid !== runId) {
    await runStore.resetStore()
    await runStore.getRun(runId)
  }
}

onBeforeMount(() => fetchData())
</script>
