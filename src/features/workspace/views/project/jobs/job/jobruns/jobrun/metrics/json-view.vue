<template>
  <v-flex :style="scrollerStyles" class="mb-4 overflow-y-auto" id="scroll-target">
    <ask-anna-loading-progress :type="'table-row'" :loading="loading">
      <metric-json-view :jsonString="metricJSON" class="mb-3" v-scroll:#scroll-target="handleOnScroll" />
    </ask-anna-loading-progress>
  </v-flex>
</template>
<script>
import { throttle } from 'lodash'
import { useWindowSize } from '@u3u/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import useMetricStore from '@/features/metric/composition/useMetricStore'
import { computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import MetricJsonView from '@/features/metric/components/metric-table/MetricJsonView.vue'

export default defineComponent({
  name: 'json-view',

  components: { MetricJsonView },

  setup(props, context) {
    const { height } = useWindowSize()
    const metricStore = useMetricStore()

    const { jobRunId: uuid } = context.root.$route.params
    const next = computed(() => metricStore.state.metricJSON.value.next)

    const query = useQuery({
      uuid,
      next,
      limit: 10,
      offset: 10,
      loading: false,
      storeAction: metricStore.actions.getMetricJSON
    })

    const loading = computed(() => metricStore.state.loading.value.metricJSON)
    const metricJSON = computed(() => JSON.stringify(metricStore.state.metricJSON.value.results, null, 2))

    const maxHeight = computed(() => height.value - 140)
    const scrollerStyles = computed(() => {
      return { 'max-height': `${maxHeight.value}px` }
    })

    const throttled = throttle(query.onScroll, 350)

    const handleOnScroll = e => {
      window.scrollTo(0, window.pageYOffset + 10)
      throttled(e.target.scrollTop)
    }

    onBeforeMount(async () => {
      await metricStore.actions.getMetricJSON({ uuid, params: { limit: 10, offset: 0 } })
    })

    return { loading, metricJSON, scrollerStyles, handleOnScroll }
  }
})
</script>
