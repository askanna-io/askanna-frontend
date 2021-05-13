<template>
  <ask-anna-loading-progress classes="mx-4 mb-4" :type="'table-row'" :loading="loading">
    <div>
      <variables-table-view
        v-if="items.length || isSorted"
        :isSorted="isSorted"
        :labels="labels"
        :sticked="sticked"
        :metricData="items"
        :height="tableHeight"
        :itemPathName="'variable'"
        :loading="loadingByParams"
        @onSort="handleOnSort"
        @onScroll="handleOnScroll"
      />
      <v-alert v-else class="ma-4 text-center" dense outlined color="grey">
        There are no variables available for this run.
      </v-alert>
    </div>
  </ask-anna-loading-progress>
</template>
<script>
import { throttle } from 'lodash'

import { useWindowSize } from '@u3u/vue-hooks'
import useQuery from '@/core/composition/useQuery'
import useJobRunStore from '@jobrun/composition/useJobRunStore'
import useProjectStore from '@/features/project/composition/useProjectStore'
import { ref, computed, onBeforeMount, defineComponent } from '@vue/composition-api'
import VariablesTableView from '@/features/runinfo-variables/components/metric-table/VariablesTableView'
import useRuninfoVariablesStore from '@/features/runinfo-variables/composition/useRuninfoVariablesStore'

export default defineComponent({
  name: 'table-view',

  components: {
    VariablesTableView
  },

  setup(props, context) {
    const { height } = useWindowSize()
    const jobRunStore = useJobRunStore()

    const projectStore = useProjectStore()
    const runinfoVariablesStore = useRuninfoVariablesStore()

    const { jobRunId: uuid } = context.root.$route.params

    const isSorted = ref(false)

    const sticked = computed(() => !projectStore.stickedVM.value)
    const next = computed(() => runinfoVariablesStore.state.variables.value.next)
    const labels = computed(() => jobRunStore.jobRun.value.variablesmeta.labels)

    const items = computed(() => runinfoVariablesStore.state.variables.value.results)
    const loading = computed(() => runinfoVariablesStore.state.loading.value.variables)

    const variablesQuery = ref({})
    const queryParams = computed({
      get: () => variablesQuery.value,
      set: val => {
        isSorted.value = true
        variablesQuery.value = val
      }
    })

    const loadingByParams = computed(() => runinfoVariablesStore.state.loading.value.variablesByParams)

    const tableHeight = computed(() => height.value - 66)

    const query = useQuery({
      next,
      uuid,
      limit: 10,
      offset: 100,
      queryParams,
      storeAction: runinfoVariablesStore.actions.getVariablesByParams
    })

    const handleOnSort = async params => {
      await runinfoVariablesStore.actions.getVariablesInitial({ uuid, params, loading: 'variablesByParams' })
      await runinfoVariablesStore.actions.setIsFiltered(true)

      const { limit, offset, ...rest } = params
      queryParams.value = rest
      query.resetParams()
    }

    const throttled = throttle(query.onScroll, 350)
    const handleOnScroll = e => throttled(e.target.scrollTop)

    onBeforeMount(async () => {
      await runinfoVariablesStore.actions.setIsFiltered(false)
      //await runinfoVariablesStore.actions.getVariablesLabels(uuid)
      await runinfoVariablesStore.actions.getVariablesInitial({ uuid, params: { limit: 100, offset: 0 } })
    })

    return {
      items,
      sticked,
      labels,
      loading,
      throttle,
      isSorted,
      tableHeight,
      loadingByParams,

      handleOnSort,
      handleOnScroll
    }
  }
})
</script>
