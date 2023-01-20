<template>
  <AskAnnaCard class="mx-auto" flat>
    <AskAnnaLoadingProgress :loading="runsStore.runsLoading">
      <Runs :suuid="suuid" :itemsPerPage="25" :tableClass="'job-sub-table'" />
    </AskAnnaLoadingProgress>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const runsStore = useRunsStore()
const { route } = useRouterAskAnna()

const { jobId: suuid } = route.params

runsStore.$reset()
</script>
