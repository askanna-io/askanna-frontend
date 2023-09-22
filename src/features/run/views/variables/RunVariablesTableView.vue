<template>
  <AskAnnaLoadingProgress
    classes="mx-4 mb-4"
    :loading="loading"
  >
    <div>
      <VariablesTable
        v-if="variables?.length || isSorted"
        :options="options"
        :labels="labels"
        :isSorted="isSorted"
        :metricData="variables"
        :itemPathName="'variable'"
        :loading="sortFilterLoading"
        @onSort="handleOnSort"
        @onScroll="handleOnScroll"
      />
      <AskAnnaAlert
        v-else
        density="compact"
        variant="outlined"
        class="m-4 text-center"
      >
        There are no variables available for this run.
      </AskAnnaAlert>
    </div>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const runStore = useRunStore()
const { route } = useRouterAskAnna()
const runVariablesStore = useRunVariablesStore()

const isSorted = ref(false)
const variablesQuery = ref({ ...route.query })

const suuid = computed(() => route.params.runId)
const next = computed(() => runVariablesStore.variables.next)
const variables = computed(() => runVariablesStore.variables?.results)
const previous = computed(() => runVariablesStore.variables.previous)
const labels = computed(() => runStore.run.variables_meta?.label_names)
const loading = computed(() => runVariablesStore.loading.variablesByParams)

const queryParams = computed({
  get: () => variablesQuery.value,
  set: val => {
    isSorted.value = true
    variablesQuery.value = val
  }
})

const { options, sortFilterLoading, onScroll, resetParams } = useQuery({
  next,
  suuid,
  previous,
  queryParams,
  loading: false,
  immediate: true,
  page_size: +queryParams.value?.page_size || 100,
  storeAction: runVariablesStore.getVariablesByParams,
  defaultOptions: { page: 1, itemsPerPage: +queryParams.value?.page_size || 100 }
})

const handleOnSort = async params => {
  runVariablesStore.isFiltered = true

  const { limit, offset, ...rest } = params
  queryParams.value = rest
  resetParams()
}

const throttled = throttle(onScroll, 350)
const handleOnScroll = e => throttled(e.target.scrollTop || e.target.firstElementChild.scrollTop)

const fetchData = async () => (runVariablesStore.isFiltered = true)

onMounted(() => fetchData())

window.addEventListener('scroll', handleOnScroll)
</script>
