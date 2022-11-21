<template>
  <AskAnnaFlex :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
    <AskAnnaLoadingProgress classes="mx-4" :loading="loading">
      <MetricJsonView :jsonString="variablesJSON" class="mb-3" v-scroll:#scroll-target="handleOnScroll" />
    </AskAnnaLoadingProgress>
  </AskAnnaFlex>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const { height } = useWindowSize()
const { route } = useRouterAskAnna()
const runVariablesStore = useRunVariablesStore()

const { runId: suuid } = route.params
const next = computed(() => runVariablesStore.variablesJSON.next)

const query = useQuery({
  suuid,
  next,
  limit: 10,
  offset: 10,
  loading: false,
  storeAction: runVariablesStore.getVariablesJSON
})

const loading = computed(() => runVariablesStore.loading.variablesJSON)
const variablesJSON = computed(() => JSON.stringify(runVariablesStore.variablesJSON.results, null, 2))

const maxHeight = computed(() => height.value - 140)
const scrollerStyles = computed(() => {
  return { 'max-height': `${maxHeight.value}px` }
})

const throttled = throttle(query.onScroll, 350)

const handleOnScroll = e => {
  window.scrollTo(0, window.pageYOffset + 10)
  throttled(e.target.scrollTop)
}

const fetchData = async () => await runVariablesStore.getVariablesJSON({ suuid, params: { limit: 10, offset: 0 } })

onBeforeMount(() => fetchData())
</script>
