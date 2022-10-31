<template>
  <AskAnnaLoadingProgress classes="mx-4 mb-4" :type="'table-row'" :loading="loading">
    <div>
      <VariablesTableView
        v-if="items.length || isSorted"
        :isSorted="isSorted"
        :labels="labels"
        :sticked="sticked"
        :metricData="items"
        :height="tableHeight"
        :itemPathName="'variable'"
        :loading="loadingByParams"
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
const projectStore = useProjectStore()
const runVariablesStore = useRunVariablesStore()

const { runId: uuid } = route.params

const isSorted = ref(false)

const sticked = computed(() => !projectStore.menu.sticked)
const labels = computed(() => runStore.run.variables_meta.label_names)
const next = computed(() => runVariablesStore.variables.next)

const items = computed(() => runVariablesStore.variables.results)
const loading = computed(() => runVariablesStore.loading.variables)

const variablesQuery = ref({})
const queryParams = computed({
  get: () => variablesQuery.value,
  set: val => {
    isSorted.value = true
    variablesQuery.value = val
  }
})

const tableHeight = computed(() => {
  const calcHeigth = (acc: number, cr: any) => {
    const h = cr.variable.type.includes('list') ? 132 : 48
    acc = acc + h

    return acc
  }

  const count = items.value.reduce(calcHeigth, 0)
  const adjusHeight = count > height.value ? height.value - 340 : count + 80

  return adjusHeight
})

const loadingByParams = computed(() => runVariablesStore.loading.variablesByParams)

const query = useQuery({
  next,
  uuid,
  limit: 10,
  offset: 100,
  queryParams,
  storeAction: runVariablesStore.getVariablesByParams
})

const handleOnSort = async params => {
  await runVariablesStore.getVariablesInitial({ uuid, params, loading: 'variablesByParams' })
  await runVariablesStore.setIsFiltered(true)

  const { limit, offset, ...rest } = params
  queryParams.value = rest
  query.resetParams()
}

const throttled = throttle(query.onScroll, 350)
const handleOnScroll = e => throttled(e.target.scrollTop)

const fetchData = async () => {
  await runVariablesStore.setIsFiltered(false)
  await runVariablesStore.getVariablesInitial({ uuid, params: { limit: 100, offset: 0 } })
}

onMounted(() => fetchData())
</script>
