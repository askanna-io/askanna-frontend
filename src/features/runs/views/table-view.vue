<template>
  <AskAnnaCard class="mx-auto" flat>
    <AskAnnaLoadingProgress :type="'table-row'" :loading="loading">
      <Runs
        :items="runs"
        :count="count"
        :itemsPerPage="25"
        :loading="runsLoading"
        :tableClass="'job-sub-table'"
        @onChangeParams="handleChangeParams"
      />
    </AskAnnaLoadingProgress>
  </AskAnnaCard>
</template>

<script setup lang="ts">
const runsStore = useRunsStore()
const { route } = useRouterAskAnna()

const { jobId: uuid } = route.params

const loading = ref(true)

const fetchData = async () => {
  await runsStore.getRuns({
    uuid,
    params: {
      limit: 25,
      offset: 0
    }
  })

  loading.value = false
}

onBeforeMount(() => fetchData())

const count = computed(() => runsStore.runs.count)
const runs = computed(() => runsStore.runs.results)
const runsLoading = computed(() => runsStore.runsLoading)

const handleChangeParams = async params => {
  await runsStore.getRuns({
    uuid,
    params
  })
}
</script>
