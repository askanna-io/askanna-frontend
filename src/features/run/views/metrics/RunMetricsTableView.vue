<template>
  <AskAnnaLoadingProgress
    classes="mx-4 mb-4"
    :loading="loading"
  >
    <div>
      <MetricTable
        v-if="metrics.length || isSorted"
        :labels="labels"
        :options="options"
        :isSorted="isSorted"
        :metricData="metrics"
        :itemPathName="'metric'"
        :loading="sortFilterLoading"
        @onSort="handleOnSort"
        @onScroll="handleOnScroll"
      />
      <AskAnnaAlert
        v-else-if="!loading"
        density="compact"
        variant="outlined"
        class="m-4 text-center"
      >There are no metrics available for this run.
      </AskAnnaAlert>
    </div>
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

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

const { sortFilterLoading, options, onScroll, resetParams } = useQuery({
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

const handleOnSort = async params => {
  metricStore.isFiltered = true

  const { limit, offset, ...rest } = params
  queryParams.value = rest
  resetParams()
}

const throttled = throttle(onScroll, 350)
const handleOnScroll = e => throttled(e.target.scrollTop || e.target.firstElementChild.scrollTop)

const fetchData = () => (metricStore.isFiltered = false)

onBeforeMount(() => fetchData())

window.addEventListener('scroll', handleOnScroll)
</script>
