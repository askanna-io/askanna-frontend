<template>
  <div>
    <v-toolbar
      v-if="!disabledTools || isFiltered"
      flat
      dense
      color="grey lighten-4"
      sticky-offset="{top: 48, bottom: 10}"
    >
      <v-flex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>

        <div>
          <v-btn
            v-if="isChartView"
            small
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            :disabled="!chart.svgData || disabledTools"
            @click="handleDownloadPNG"
          >
            <v-icon color="secondary" left>mdi-download</v-icon>Download PNG
          </v-btn>

          <v-btn
            v-if="!$vuetify.breakpoint.xsOnly && !isChartView"
            small
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload"
            :disabled="disabledTools"
          >
            <v-icon color="secondary" left>mdi-download</v-icon>Download JSON
          </v-btn>
          <v-btn
            v-if="!isChartView"
            small
            outlined
            color="secondary"
            @click="handleCopy"
            class="mr-1 btn--hover"
            :disabled="disabledTools"
          >
            <v-icon color="secondary" left>mdi-content-copy</v-icon>Copy JSON
          </v-btn>
        </div>

        <v-btn-toggle v-model="currentViewIndex" mandatory class="mr-1">
          <v-tooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" small class="btn--hover" outlined color="secondary" @click="handleChangeView(index)">
                <v-icon color="secondary">{{ view.icon }}</v-icon>
              </v-btn>
            </template>
            <span>{{ view.name }}</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-flex>
    </v-toolbar>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import useCopy from '@/core/composition/useCopy'
import { useChartStore } from '@/features/charts/useChartStore'
import useChartDownload from '@/features/charts/useChartDownload'
import useRouterAskAnna from '@/core/composition/useRouterAskAnna'
import { useMetricStore } from '@/features/metric/useMetricStore'
import { ref, computed, onBeforeMount } from '@vue/composition-api'
import useForceFileDownload from '@/core/composition/useForceFileDownload'

const copy = useCopy()
const chart = useChartStore()
const router = useRouterAskAnna()
const metricStore = useMetricStore()
const chartDownload = useChartDownload()
const forceFileDownload = useForceFileDownload()

const { runId: uuid } = router.route.value.params

const views = [
  { name: 'Table', value: 'table', icon: 'mdi-table' },
  { name: 'Chart', value: 'chart', icon: 'mdi-chart-areaspline-variant' },
  { name: 'JSON', value: 'json', icon: 'mdi-code-json' }
]

const currentView = ref(views[0])
const currentViewIndex = ref(0)

const items = computed(() => metricStore.metrics.results)
const isFiltered = computed(() => metricStore.isFiltered)

const metricJSON = computed(() => JSON.stringify(metricStore.metricJSON.results, null, 2))
const isChartView = computed(() => currentView.value.value === 'chart')
const disabledTools = computed(
  () =>
    (currentView.value.value === 'table' && !items.value.length) ||
    (currentView.value.value === 'json' && !metricJSON.value)
)

const handleCopy = async () => {
  if (!metricStore.metricFullData) await metricStore.getMetricFullData({ uuid })

  copy.handleCopyText(metricStore.metricFullData)
}

const handleDownload = async () => {
  if (!metricStore.metricFullData) await metricStore.getMetricFullData({ uuid })

  forceFileDownload.trigger({ source: metricStore.metricFullData, name: `run_${uuid}_metrics.json` })
}

const fetchData = async () => {
  await metricStore.$reset()
  const view = router.route.value.meta.tabValue
  if (view) {
    currentView.value = views.find(item => item.value === view)
    currentViewIndex.value = views.findIndex(item => item.value === view)
  }
}

const handleChangeView = (index: number) => {
  const view = views[index]
  currentViewIndex.value = index
  if (view.value === currentView.value.value) return
  currentView.value = view
  router.push({ name: `workspace-project-jobs-job-jobrun-metrics-${view.value}` })
}

const handleDownloadPNG = () => {
  const activeS = chart.activeS ? '_' + chart.activeS : ''
  chartDownload.save(chart.svgData, `run_${uuid}_metrics_${chart.activeY}_${chart.activeX}${activeS}.png`)
}

onBeforeMount(() => fetchData())
</script>
<style scoped>
.h-20 {
  height: 20px !important;
}
</style>
