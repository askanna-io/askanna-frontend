<template>
  <v-flex :style="scrollerStyles" class="overflow-y-auto" id="scroll-target">
    <ask-anna-loading-progress :type="'table-row'" classes="mx-4" :loading="loading">
      <metric-json-view :jsonString="variablesJSON" class="mb-3" v-scroll:#scroll-target="handleOnScroll" />
    </ask-anna-loading-progress>
  </v-flex>
</template>
<script>
import { throttle } from 'lodash'
import { useWindowSize } from '@u3u/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import useRuninfoVariablesStore from '@/features/runinfo-variables/composition/useRuninfoVariablesStore'

import { computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import MetricJsonView from '@/features/metric/components/metric-table/MetricJsonView.vue'

export default defineComponent({
  name: 'json-view',

  components: { MetricJsonView },

  setup(props, context) {
    const { height } = useWindowSize()
    const runinfoVariablesStore = useRuninfoVariablesStore()

    const { jobRunId: uuid } = context.root.$route.params
    const next = computed(() => runinfoVariablesStore.state.variablesJSON.value.next)

    const query = useQuery({
      uuid,
      next,
      limit: 10,
      offset: 10,
      loading: false,
      storeAction: runinfoVariablesStore.actions.getVariablesJSON
    })

    const loading = computed(() => runinfoVariablesStore.state.loading.value.variablesJSON)
    const variablesJSON = computed(() =>
      JSON.stringify(runinfoVariablesStore.state.variablesJSON.value.results, null, 2)
    )

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
      await runinfoVariablesStore.actions.getVariablesJSON({ uuid, params: { limit: 10, offset: 0 } })
    })

    return { loading, variablesJSON, scrollerStyles, handleOnScroll }
  }
})
</script>
