<template>
  <AskAnnaLoadingProgress classes="mx-4 mb-4" :type="'table-row'" :loading="loading">
    <div>
      <metric-table-view
        v-if="items.length || isSorted"
        :isSorted="isSorted"
        :labels="labels"
        :sticked="sticked"
        :metricData="items"
        :height="tableHeight"
        :itemPathName="'metric'"
        :loading="loadingByParams"
        @onSort="handleOnSort"
        @onScroll="handleOnScroll"
      />
      <v-alert v-else class="ma-4 text-center" dense outlined>There are no metrics available for this run. </v-alert>
    </div>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const { height } = useWindowSize()
const metricStore = useMetricStore()
const { route } = useRouterAskAnna()
const projectStore = useProjectStore()

const { runId: uuid } = route.params

const isSorted = ref(false)
const metricsQuery = ref({})

const next = computed(() => metricStore.metrics.next)
const items = computed(() => metricStore.metrics.results)
const loading = computed(() => metricStore.loading.metric)
const sticked = computed(() => !projectStore.menu.sticked)
const labels = computed(() => metricStore.metricMeta.label_names)

const queryParams = computed({
  get: () => metricsQuery.value,
  set: val => {
    isSorted.value = true
    metricsQuery.value = val
  }
})

const loadingByParams = computed(() => metricStore.loading.metricByParams)

const tableHeight = computed(() => {
  const calcHeigth = (acc: number, cr: any) => {
    const h = cr.metric.type.includes('list') ? 132 : 48
    acc = acc + h

    return acc
  }

  const count = items.value.reduce(calcHeigth, 0)
  const adjusHeight = count > height.value ? height.value - 340 : count + 80

  return adjusHeight
})

const query = useQuery({
  next,
  uuid,
  limit: 10,
  offset: 100,
  queryParams,
  storeAction: metricStore.getMetricByParams
})

const handleOnSort = async params => {
  await metricStore.getMetricInitial({ uuid, params, loading: 'metricByParams' })
  metricStore.isFiltered = true

  const { limit, offset, ...rest } = params
  queryParams.value = rest
  query.resetParams()
}

const throttled = throttle(query.onScroll, 350)
const handleOnScroll = e => throttled(e.target.scrollTop)

const fetchData = async () => {
  metricStore.isFiltered = false

  await metricStore.getMetricMeta(uuid)
  await metricStore.getMetricInitial({ uuid, params: { limit: 100, offset: 0 } })
}

onBeforeMount(() => fetchData())
</script>