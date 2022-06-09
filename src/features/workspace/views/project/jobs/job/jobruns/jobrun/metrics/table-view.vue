<template>
  <ask-anna-loading-progress classes="mx-4 mb-4" :type="'table-row'" :loading="loading">
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
  </ask-anna-loading-progress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'
import { useRouter } from '@u3u/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import { useMetricStore } from '@/features/metric/useMetricStore'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import useProjectStore from '@/features/project/composition/useProjectStore'
import MetricTableView from '@/features/metric/components/metric-table/MetricTableView.vue'

const { route } = useRouter()
const metricStore = useMetricStore()
const projectStore = useProjectStore()

const { jobRunId: uuid } = route.value.params

const isSorted = ref(false)
const metricsQuery = ref({})

const next = computed(() => metricStore.metrics.next)
const items = computed(() => metricStore.metrics.results)
const loading = computed(() => metricStore.loading.metric)
const sticked = computed(() => !projectStore.stickedVM.value)
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

  return count + 80
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
