<template>
  <AskAnnaCard class="mx-auto" flat>
    <AskAnnaLoadingProgress :loading="runsStore.runsLoading">
      <Runs :suuid="suuid" :itemsPerPage="itemsPerPage" :tableClass="'job-sub-table'" />
    </AskAnnaLoadingProgress>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const runsStore = useRunsStore()
const { route } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const itemsPerPage = computed(() => +queryParams.value?.page_size || 25)

const { jobId: suuid } = route.params

runsStore.$reset()
</script>
