<template>
  <AskAnnaLoadingProgress classes="mx-4 mb-4" :loading="loading">
    <div>
      <VariablesTableView
        v-if="variables.length || isSorted"
        :isSorted="isSorted"
        :labels="labels"
        :metricData="variables"
        :height="tableHeight"
        :itemPathName="'variable'"
        :loading="sortFilterLoading"
        @onSort="handleOnSort"
        @onScroll="handleOnScroll"
      />
      <AskAnnaAlert v-else class="ma-4 text-center" dense outlined>
        There are no variables available for this run.
      </AskAnnaAlert>
    </div>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const runStore = useRunStore()
const { height } = useWindowSize()
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

const { sortFilterLoading, onScroll, resetParams } = useQuery({
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

const tableHeight = computed(() => {
  const calcHeigth = (acc: number, cr: any) => {
    const h = cr.variable.type.includes('list') ? 132 : 48
    acc = acc + h

    return acc
  }

  const count = variables.value.reduce(calcHeigth, 0)
  const adjusHeight = count > height.value ? height.value - 340 : count + 80

  return adjusHeight
})

const handleOnSort = async params => {
  runVariablesStore.isFiltered = true

  const { limit, offset, ...rest } = params
  queryParams.value = rest
  resetParams()
}

const throttled = throttle(onScroll, 350)
const handleOnScroll = e => throttled(e.target.scrollTop)

const fetchData = async () => (runVariablesStore.isFiltered = true)

onMounted(() => fetchData())
</script>
