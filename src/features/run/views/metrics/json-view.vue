<template>
  <AskAnnaFlex :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
    <AskAnnaLoadingProgress classes="mx-4" :loading="loading">
      <MetricJsonView :jsonString="metricJSON" class="mb-3" v-scroll:#scroll-target="handleOnScroll" />
    </AskAnnaLoadingProgress>
  </AskAnnaFlex>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const { height } = useWindowSize()
const metricStore = useMetricStore()
const { route } = useRouterAskAnna()

const queryParams = computed(() => route.query)
const suuid = computed(() => route.params.runId)
const next = computed(() => metricStore.metricJSON.next)

const { onScroll } = useQuery({
  next,
  suuid,
  queryParams,
  loading: true,
  immediate: true,
  storeAction: metricStore.getMetricJSON,
  page_size: +queryParams.value?.page_size || 100,
  defaultOptions: { page: 1, itemsPerPage: +queryParams.value?.page_size || 100 }
})

const loading = computed(() => metricStore.loading.metricJSON)
const metricJSON = computed(() => JSON.stringify(metricStore.metricJSON.results, null, 2))

const maxHeight = computed(() => height.value - 140)
const scrollerStyles = computed(() => {
  return { 'max-height': `${maxHeight.value}px` }
})

const throttled = throttle(onScroll, 350)

const handleOnScroll = e => {
  window.scrollTo(0, window.pageYOffset + 10)
  throttled(e.target.scrollTop)
}
</script>
