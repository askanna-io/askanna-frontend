<template>
  <v-flex :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
    <ask-anna-loading-progress :type="'table-row'" classes="mx-4" :loading="loading">
      <metric-json-view :jsonString="metricJSON" class="mb-3" v-scroll:#scroll-target="handleOnScroll" />
    </ask-anna-loading-progress>
  </v-flex>
</template>
<script lang="ts">
import { throttle } from 'lodash'
import { useWindowSize } from '@/core/plugins/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import { useMetricStore } from '@/features/metric/useMetricStore'
import { computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import MetricJsonView from '@/features/metric/components/metric-table/MetricJsonView.vue'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'

export default defineComponent({
  name: 'json-view',

  components: { MetricJsonView, AskAnnaLoadingProgress },

  setup(_, context) {
    const { height } = useWindowSize()
    const metricStore = useMetricStore()

    const { runId: uuid } = context.root.$route.params
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

    return { loading, metricJSON, scrollerStyles, handleOnScroll }
  }
})
</script>
