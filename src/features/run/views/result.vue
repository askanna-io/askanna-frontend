<template>
  <RunResult v-if="run.suuid" :run="run" />
</template>

<script setup lang="ts">
const runStore = useRunStore()
const fileStore = useFileStore()
const { route } = useRouterAskAnna()

const run = computed(() => runStore.run)

const fetchData = async () => {
  fileStore.$reset()

  const { runId } = route.params

  if (runStore.run.suuid !== runId) {
    await runStore.resetStore()
    await runStore.getRun(runId)
  }
}

onBeforeMount(() => fetchData())
</script>
