<template>
  <RunLog />
</template>

<script setup lang="ts">
const fileStore = useFileStore()

const fetchData = async () => await fileStore.$reset()

onBeforeMount(() => fetchData())
</script>
