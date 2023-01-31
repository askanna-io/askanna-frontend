<template>
  <AskAnnaLoadingProgress classes="mx-4 mb-4" :loading="loading">
    <div>
      <MetricTableView
        v-if="metrics.length || isSorted"
        :isSorted="isSorted"
        :labels="labels"
        :metricData="metrics"
        :height="tableHeight"
        :loading="sortFilterLoading"
        :itemPathName="'metric'"
        @onSort="handleOnSort"
        @onScroll="handleOnScroll"
      />
      <AskAnnaAlert v-else-if="!loading" class="ma-4 text-center" dense outlined
        >There are no metrics available for this run.
      </AskAnnaAlert>
    </div>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const { height } = useWindowSize()
const metricStore = useMetricStore()
const { route } = useRouterAskAnna()

const isSorted = ref(false)
const metricsQuery = ref({ ...route.query })

const suuid = computed(() => route.params.runId)
const next = computed(() => metricStore.metrics.next)
const metrics = computed(() => metricStore.metrics.results)
const previous = computed(() => metricStore.metrics.previous)
const labels = computed(() => metricStore.metricMeta.label_names)
const loading = computed(() => metricStore.loading.metricByParams)

const queryParams = computed({
  get: () => metricsQuery.value,
  set: val => {
    isSorted.value = true
    metricsQuery.value = val
  }
})

const { sortFilterLoading, onScroll, resetParams } = useQuery({
  next,
  suuid,
  previous,
  queryParams,
  loading: false,
  immediate: true,
  storeAction: metricStore.getMetricByParams,
  page_size: +queryParams.value?.page_size || 100,
  defaultOptions: { page: 1, itemsPerPage: +queryParams.value?.page_size || 100 }
})

const tableHeight = computed(() => {
  const calcHeigth = (acc: number, cr: any) => {
    const h = cr.metric.type.includes('list') ? 132 : 48
    acc = acc + h

    return acc
  }

  const count = metrics.value.reduce(calcHeigth, 0)
  const adjusHeight = count > height.value ? height.value - 60 : count + 80

  return adjusHeight
})

const handleOnSort = async params => {
  metricStore.isFiltered = true

  const { limit, offset, ...rest } = params
  queryParams.value = rest
  resetParams()
}

const throttled = throttle(onScroll, 350)
const handleOnScroll = e => throttled(e.target.scrollTop)

const fetchData = () => (metricStore.isFiltered = false)

onBeforeMount(() => fetchData())
</script>
