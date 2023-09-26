<template>
  <AskAnnaToolbar
    v-if="!disabledTools || isFiltered"
    flat
    class="z-10 askanna-sticky"
  >
    <div class="flex w-full items-center justify-between gap-2">
      <div class="cut-text flex items-center"></div>
      <div class="mr-auto flex items-center"></div>
      <div class="flex gap-2">
        <AskAnnaButtonScrollToTop />
        <AskAnnaButton
          v-if="isChartView"
          prependIcon="mdi-download"
          :disabled="!chart.svgData || disabledTools"
          @click="handleDownloadPNG"
        >
          Download PNG
        </AskAnnaButton>
        <AskAnnaButton
          v-if="!$vuetify.display.xs && !isChartView"
          :disabled="disabledTools"
          prependIcon="mdi-download"
          @click="handleDownload"
        >
          Download JSON
        </AskAnnaButton>
        <AskAnnaButton
          v-if="!isChartView"
          :disabled="disabledTools"
          prependIcon="mdi-content-copy"
          @click="handleCopy"
        >
          Copy JSON
        </AskAnnaButton>
      </div>

      <AskAnnaBtnToggle
        class="h-7 mr-2"
        :model-value="currentViewIndex"
      >
        <AskAnnaButtonIcon
          v-for="(view, index) in views"
          :key="index"
          class="border-main"
          @click="handleChangeView(index)"
        >
          <AskAnnaIcon :icon="view.icon" />
          <AskAnnaTooltip>
            {{ view.name }}
          </AskAnnaTooltip>
        </AskAnnaButtonIcon>
      </AskAnnaBtnToggle>
    </div>
  </AskAnnaToolbar>
  <RouterView />
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

const currentView = ref(views[0])

const items = computed(() => metricStore.metrics.results)
const isFiltered = computed(() => metricStore.isFiltered)

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

  routerPush({ name: `workspace-project-jobs-job-run-metrics-${view.value}`, params: { ...route.params, view: currentView.value.value } })
  currentView.value = views[index]
}

const handleDownloadPNG = () => {
  const activeS = chart.activeS ? '_' + chart.activeS : ''
  chartDownload.save(chart.svgData, `run_${suuid}_metrics_${chart.activeY}_${chart.activeX}${activeS}.png`)
}

const init = () => {
  if (route.meta.tabValue) {
    currentView.value = views.find(el => el.value === route.meta.tabValue) || views[0]
  }
}

init()
</script>
