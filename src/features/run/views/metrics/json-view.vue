<template>
  <v-flex :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
    <AskAnnaLoadingProgress :type="'table-row'" classes="mx-4" :loading="loading">
      <MetricJsonView :jsonString="metricJSON" class="mb-3" v-scroll:#scroll-target="handleOnScroll" />
    </AskAnnaLoadingProgress>
  </v-flex>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const { height } = useWindowSize()
const metricStore = useMetricStore()
const { route } = useRouterAskAnna()

const { runId: uuid } = route.params
const next = computed(() => metricStore.metricJSON.next)

const query = useQuery({
  uuid,
  next,
  limit: 10,
  offset: 10,
  loading: false,
  storeAction: metricStore.getMetricJSON
})

const loading = computed(() => metricStore.loading.metricJSON)
const metricJSON = computed(() => JSON.stringify(metricStore.metricJSON.results, null, 2))

const maxHeight = computed(() => height.value - 140)
const scrollerStyles = computed(() => {
  return { 'max-height': `${maxHeight.value}px` }
})

const throttled = throttle(query.onScroll, 350)

const handleOnScroll = e => {
  window.scrollTo(0, window.pageYOffset + 10)
  throttled(e.target.scrollTop)
}

const fetchData = async () => await metricStore.getMetricJSON({ uuid, params: { limit: 10, offset: 0 } })
onBeforeMount(() => fetchData())
</script>
