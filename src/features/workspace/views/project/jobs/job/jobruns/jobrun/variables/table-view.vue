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
      <v-alert v-else class="ma-4 text-center" dense outlined> There are no variables available for this run. </v-alert>
    </div>
  </ask-anna-loading-progress>
</template>
<script setup lang="ts">
import { throttle } from 'lodash'
import useQuery from '@/core/composition/useQuery'
import { useRouter, useWindowSize } from '@u3u/vue-hooks'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import useJobRunStore from '@/features/jobrun/composition/useJobRunStore'
import useProjectStore from '@/features/project/composition/useProjectStore'
import useRuninfoVariablesStore from '@/features/runinfo-variables/composition/useRuninfoVariablesStore'
import VariablesTableView from '@/features/runinfo-variables/components/metric-table/VariablesTableView.vue'

const { route } = useRouter()
const { height } = useWindowSize()
const jobRunStore = useJobRunStore()
const projectStore = useProjectStore()
const runinfoVariablesStore = useRuninfoVariablesStore()

const { jobRunId: uuid } = route.value.params

const isSorted = ref(false)

const sticked = computed(() => !projectStore.stickedVM.value)
const next = computed(() => runinfoVariablesStore.state.variables.value.next)
const labels = computed(() => jobRunStore.state.jobRun.value.variablesmeta.labels)

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

const tableHeight = computed(() => height.value - 66)
const loadingByParams = computed(() => runinfoVariablesStore.state.loading.value.variablesByParams)

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

const fetchData = async () => {
  await runinfoVariablesStore.actions.setIsFiltered(false)
  await runinfoVariablesStore.actions.getVariablesInitial({ uuid, params: { limit: 100, offset: 0 } })
}

onBeforeMount(() => fetchData())
</script>
