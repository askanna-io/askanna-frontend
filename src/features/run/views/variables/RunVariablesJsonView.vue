<template>
  <AskAnnaLoadingProgress
    classes="mx-4"
    :loading="loading"
  >
    <MetricJsonView
      class="mb-3"
      :jsonString="variablesJSON"
      v-scroll:#scroll-target="handleOnScroll"
    />
  </AskAnnaLoadingProgress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'

const { route } = useRouterAskAnna()
const runVariablesStore = useRunVariablesStore()

const queryParams = computed(() => route.query)
const suuid = computed(() => route.params.runId)
const next = computed(() => runVariablesStore.variablesJSON.next)

const query = useQuery({
  next,
  suuid,
  loading: false,
  immediate: true,
  page_size: +queryParams.value?.page_size || 100,
  storeAction: runVariablesStore.getVariablesJSON
})

const loading = computed(() => runVariablesStore.loading.variablesJSON)
const variablesJSON = computed(() => JSON.stringify(runVariablesStore.variablesJSON.results, null, 2))

const throttledScroll = throttle(query.onScroll, 550)
const handleOnScroll = e => throttledScroll(e.target.scrollTop || e.target.firstElementChild.scrollTop)

window.addEventListener('scroll', handleOnScroll)
</script>
