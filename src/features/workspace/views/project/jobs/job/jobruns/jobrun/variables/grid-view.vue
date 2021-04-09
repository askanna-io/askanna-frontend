<template>
  <metric-table-view-grid :items="items" :labels="labels" :loading="loading" :sticked="false" @onSort="handleOnSort" />
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'
import useMetricStore from '@/features/metric/composition/useMetricStore'
import useProjectStore from '@/features/project/composition/useProjectStore'
import MetricTableViewGrid from '@/features/metric/components/metric-table/MetricTableViewGrid'

export default defineComponent({
  name: 'grid-view',

  components: {
    MetricTableViewGrid
  },

  setup(props, context) {
    const metricStore = useMetricStore()
    const projectStore = useProjectStore()

    const { jobRunId: uuid } = context.root.$route.params

    const items = computed(() => metricStore.state.metrics.value.results)
    const labels = computed(() => metricStore.state.metricLabels.value)
    const loading = computed(() => metricStore.state.loading.value.metricByParams)

    const sticked = computed(() => !projectStore.stickedVM.value)

    const handleOnSort = async params => await metricStore.actions.getMetricByParams({ uuid, params })

    return { items, loading, labels, sticked, handleOnSort }
  }
})
</script>
