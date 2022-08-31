<template>
  <v-flex :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
    <AskAnnaLoadingProgress :type="'table-row'" classes="mx-4" :loading="loading">
      <metric-json-view :jsonString="variablesJSON" class="mb-3" v-scroll:#scroll-target="handleOnScroll" />
    </AskAnnaLoadingProgress>
  </v-flex>
</template>
<script lang="ts">
import { throttle } from 'lodash'
import { useWindowSize } from '@/core/plugins/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import { computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import AskAnnaLoadingProgress from '@/core/components/shared/AskAnnaLoadingProgress.vue'
import MetricJsonView from '@/features/metric/components/metric-table/MetricJsonView.vue'
import { useRunVariablesStore } from '@/features/run-variables/useRunVariablesStore'

export default defineComponent({
  name: 'json-view',

  components: { MetricJsonView, AskAnnaLoadingProgress },

  setup(_, context) {
    const { height } = useWindowSize()
    const runVariablesStore = useRunVariablesStore()

    const { runId: uuid } = context.root.$route.params
    const next = computed(() => runVariablesStore.variablesJSON.next)

    const query = useQuery({
      uuid,
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

    const fetchData = async () => await runVariablesStore.getVariablesJSON({ uuid, params: { limit: 10, offset: 0 } })

    onBeforeMount(() => fetchData())

    return { loading, variablesJSON, scrollerStyles, handleOnScroll }
  }
})
</script>
