<template>
  <metric-card-view :items="items" :labels="labels" />
</template>
<script>
import MetricCardView from '@/features/metric/components/metric-table/MetricCardView'

import useMetricStore from '@/features/metric/composition/useMetricStore'

import { computed, defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'card-view',

  components: {
    MetricCardView
  },

  setup() {
    const metricStore = useMetricStore()

    const items = computed(() => metricStore.state.metrics.value.results)
    const labels = computed(() => metricStore.state.metricLabels.value)

    return { items, labels }
  }
})
</script>
