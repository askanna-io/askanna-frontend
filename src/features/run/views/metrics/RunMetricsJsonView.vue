<template>
  <AskAnnaLoadingProgress
    classes="mx-4"
    :loading="loading"
  >
    <MetricJsonView
      class="mb-3"
      :jsonString="metricJSON"
    />
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const metricStore = useMetricStore()
const { route } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const suuid = computed(() => route.params.runId)
const next = computed(() => metricStore.metricJSON.next)

const { onScroll } = useQuery({
  next,
  suuid,
  queryParams,
  loading: false,
  immediate: true,
  storeAction: metricStore.getMetricJSON,
  page_size: +queryParams.value?.page_size || 100,
  defaultOptions: { page: 1, itemsPerPage: +queryParams.value?.page_size || 100 }
})

const loading = computed(() => metricStore.loading.metricJSON)
const metricJSON = computed(() => JSON.stringify(metricStore.metricJSON.results, null, 2))

const throttledScroll = throttle(onScroll, 3330)
const handleOnScroll = e => throttledScroll(e.target.scrollTop || e.target.firstElementChild.scrollTop)

window.addEventListener('scroll', handleOnScroll)
</script>
