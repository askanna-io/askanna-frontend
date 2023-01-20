<template>
  <RunResult v-if="run.suuid" :run="run" />
</template>

<script setup lang="ts">
const runStore = useRunStore()
const fileStore = useFileStore()

const run = computed(() => runStore.run)

const fetchData = async () => await fileStore.$reset()

onBeforeMount(() => fetchData())
</script>
