<template>
  <ask-anna-loading-progress :type="'table-row'" :loading="loading">
    <div>
      <metric-table-view
        v-if="items.length"
        :labels="labels"
        :sticked="sticked"
        :metricData="items"
        :height="tableHeight"
        :loading="loadingByParams"
        @onSort="handleOnSort"
        @onScroll="handleOnScroll"
      />
      <v-alert v-else class="mt-2 text-center" dense outlined color="grey">
        There are no metrics available for this run.
      </v-alert>
    </div>
  </ask-anna-loading-progress>
</template>
<script>
import { throttle } from 'lodash'

import { useWindowSize } from '@u3u/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import useMetricStore from '@/features/metric/composition/useMetricStore'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import MetricTableView from '@/features/metric/components/metric-table/MetricTableView'

export default defineComponent({
  name: 'table-view',

  components: {
    MetricTableView
  },

  setup(props, context) {
    const { height } = useWindowSize()
    const metricStore = useMetricStore()
    const projectStore = useProjectStore()

    const { jobRunId: uuid } = context.root.$route.params

    const sticked = computed(() => !projectStore.stickedVM.value)
    const next = computed(() => metricStore.state.metrics.value.next)
    const labels = computed(() => metricStore.state.metricLabels.value)
    const items = computed(() => metricStore.state.metrics.value.results)
    const loading = computed(() => metricStore.state.loading.value.metric)
    const loadingByParams = computed(() => metricStore.state.loading.value.metricByParams)

    const tableHeight = computed(() => height.value - 66)

    const handleOnSort = async params =>
      await metricStore.actions.getMetricInitial({ uuid, params, loading: 'metricByParams' })

    const query = useQuery({
      next,
      uuid,
      limit: 10,
      offset: 100,
      storeAction: metricStore.actions.getMetricByParams
    })
    const throttled = throttle(query.onScroll, 350)
    const handleOnScroll = e => throttled(e.target.scrollTop)

    onBeforeMount(async () => {
      await metricStore.actions.getMetricLabels(uuid)
      await metricStore.actions.getMetricInitial({ uuid, params: { limit: 100, offset: 0 } })
    })

    return { items, throttle, sticked, labels, loading, tableHeight, loadingByParams, handleOnSort, handleOnScroll }
  }
})
</script>
