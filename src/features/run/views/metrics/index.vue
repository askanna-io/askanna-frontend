<template>
  <div>
    <AskAnnaToolbar
      v-if="!disabledTools || isFiltered"
      flat
      dense
      color="grey lighten-4"
      sticky-offset="{top: 48, bottom: 10}"
    >
      <AskAnnaFlex class="d-flex">
        <div class="mr-auto d-flex align-center"></div>

        <div>
          <AskAnnaButton
            v-if="isChartView"
            small
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            :disabled="!chart.svgData || disabledTools"
            @click="handleDownloadPNG"
          >
            <AskAnnaIcon color="secondary" left>mdi-download</AskAnnaIcon>Download PNG
          </AskAnnaButton>

          <AskAnnaButton
            v-if="!$vuetify.breakpoint.xsOnly && !isChartView"
            small
            outlined
            color="secondary"
            class="mr-1 btn--hover"
            @click="handleDownload"
            :disabled="disabledTools"
          >
            <AskAnnaIcon color="secondary" left>mdi-download</AskAnnaIcon>Download JSON
          </AskAnnaButton>
          <AskAnnaButton
            v-if="!isChartView"
            small
            outlined
            color="secondary"
            @click="handleCopy"
            class="mr-1 btn--hover"
            :disabled="disabledTools"
          >
            <AskAnnaIcon color="secondary" left>mdi-content-copy</AskAnnaIcon>Copy JSON
          </AskAnnaButton>
        </div>

        <VBtnToggle :value="currentViewIndex" mandatory class="mr-1">
          <AskAnnaTooltip v-for="(view, index) in views" top :key="index">
            <template v-slot:activator="{ on }">
              <AskAnnaButton
                v-on="on"
                small
                class="btn--hover"
                outlined
                color="secondary"
                @click="handleChangeView(index)"
              >
                <AskAnnaIcon color="secondary">{{ view.icon }}</AskAnnaIcon>
              </AskAnnaButton>
            </template>
            <span>{{ view.name }}</span>
          </AskAnnaTooltip>
        </VBtnToggle>
      </AskAnnaFlex>
    </AskAnnaToolbar>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
const copy = useCopy()
const chart = useChartStore()
const metricStore = useMetricStore()
const chartDownload = useChartDownload()
const { route, routerPush } = useRouterAskAnna()
const forceFileDownload = useForceFileDownload()

const { runId: suuid } = route.params

const views = [
  { name: 'Table', value: 'table', icon: 'mdi-table' },
  { name: 'Chart', value: 'chart', icon: 'mdi-chart-areaspline-variant' },
  { name: 'JSON', value: 'json', icon: 'mdi-code-json' }
]

const items = computed(() => metricStore.metrics.results)
const isFiltered = computed(() => metricStore.isFiltered)

const currentView = computed(() => views.find(item => item.value === route.meta.tabValue))
const currentViewIndex = computed(() => views.findIndex(item => item.value === route.meta.tabValue))

const isChartView = computed(() => currentView.value.value === 'chart')
const metricJSON = computed(() => JSON.stringify(metricStore.metricJSON.results, null, 2))
const disabledTools = computed(
  () =>
    (currentView.value.value === 'table' && !items.value.length) ||
    (currentView.value.value === 'json' && !metricJSON.value)
)

const handleCopy = async () => {
  if (!metricStore.metricFullData) await metricStore.getMetricFullData({ suuid })

  copy.handleCopyText(metricStore.metricFullData)
}

const handleDownload = async () => {
  if (!metricStore.metricFullData) await metricStore.getMetricFullData({ suuid })

  forceFileDownload.trigger({ source: metricStore.metricFullData, name: `run_${suuid}_metrics.json` })
}

const handleChangeView = async (index: number) => {
  const view = views[index]
  if (view.value === currentView.value.value) return

  if (view.value === 'chart') await chart.$reset()

  routerPush({ name: `workspace-project-jobs-job-run-metrics-${view.value}` })
}

const handleDownloadPNG = () => {
  const activeS = chart.activeS ? '_' + chart.activeS : ''
  chartDownload.save(chart.svgData, `run_${suuid}_metrics_${chart.activeY}_${chart.activeX}${activeS}.png`)
}
</script>
<style scoped>
.h-20 {
  height: 20px !important;
}
</style>
