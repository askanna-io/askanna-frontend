<template>
  <div>
    <AskAnnaContainer v-if="chart.isEditMode" fluid class="py-0" :style="{ maxWidth: '900px' }">
      <AskAnnaRow class="l-chart mx-0" justify="space-between">
        <AskAnnaCol class="d-flex" cols="12" sm="4">
          <AskAnnaSelect
            dense
            clearable
            hide-details
            width="200px"
            return-object
            label="Y-axis"
            no-data-text=""
            v-model="activeY"
            item-text="name"
            item-value="value"
            :items="yAxisList"
          >
          </AskAnnaSelect>
        </AskAnnaCol>
        <AskAnnaCol class="d-flex" cols="12" sm="4">
          <AskAnnaSelect
            dense
            clearable
            hide-details
            label="X-axis"
            return-object
            width="200px"
            no-data-text=""
            v-model="activeX"
            item-text="title"
            item-value="value"
            :items="xAxisList"
            @click:clear.stop="hadnleResetX"
          >
          </AskAnnaSelect>
        </AskAnnaCol>
        <AskAnnaCol class="d-flex" cols="12" sm="4" :class="{ 'last-item': !$vuetify.breakpoint.xsOnly }">
          <AskAnnaSelect
            dense
            clearable
            hide-details
            label="Series"
            width="200px"
            return-object
            no-data-text=""
            v-model="activeS"
            item-text="title"
            item-value="value"
            :items="seriesList"
            :disabled="!seriesList.length"
          >
          </AskAnnaSelect>
        </AskAnnaCol>
      </AskAnnaRow>

      <Chart :data="data" :height="chartHeight" :xAxis="activeX" :yAxis="activeY" />

      <AskAnnaRow justify="center" class="px-2">
        <AskAnnaAlert
          v-if="chart.activeX && count > 10000"
          class="ma-4 text-center"
          dense
          outlined
          style="max-width: 900px; width: 100%"
          >The chart only shows the first 10 000 values.</AskAnnaAlert
        >
      </AskAnnaRow>
    </AskAnnaContainer>
  </div>
</template>

<script setup lang="ts">
const alloweTypes = ['list', 'float', 'integer', 'list_float', 'list_integer']

const xAxisListPredefined = [
  {
    title: 'Element',
    value: 1,
    xType: 'scaleLinear',
    type: 'integer',
    name: 'element'
  },
  {
    title: 'Date-time',
    value: 2,
    xType: 'scaleUtc',
    type: 'string',
    name: 'date-time'
  }
]

const chart = useChartStore()
const { height } = useWindowSize()
const metricStore = useMetricStore()
const { route } = useRouterAskAnna()

const { runId: suuid } = route.params

const activeY = ref()
const activeS = ref()
const activeX = ref(xAxisListPredefined[0])

const count = computed(() => metricStore.metricMeta.count)
const isListTypeSelected = computed(() => activeX.value?.type.includes('list') || activeY.value?.type.includes('list'))

const yAxisList = computed(() => {
  if (!metricStore.metricData.length) return []

  const metricNames = metricStore.metricMeta.metric_names.filter(item => alloweTypes.includes(item.type))

  return metricNames || []
})

const xAxisList = computed(() => {
  if (!metricStore.metricMeta.label_names.length) return xAxisListPredefined

  const labels = metricStore.metricMeta.label_names
    .filter(item => alloweTypes.includes(item.type))
    .filter(item => item.name !== activeS.value?.name)
    .map((item, index) => ({
      name: item.name,
      type: item.type,
      value: 3 + index,
      xType: 'scaleLinear',
      title: `Label: ${item.name}`,
      disabled:
        (isListTypeSelected.value && !item.type.includes('list')) ||
        (!isListTypeSelected.value && item.type.includes('list'))
    }))

  return [...xAxisListPredefined, ...labels]
})

const seriesList = computed(() => {
  if (!metricStore.metricData.length) return []

  const labels = metricStore.metricMeta.label_names
    .filter(item => item.name !== activeX.value?.name)
    .map((item, index) => ({
      name: item.name,
      type: item.type,
      value: 3 + index,
      xType: 'scaleLinear',
      title: `Label: ${item.name}`
    }))

  return labels || []
})

const data = computed(() => {
  if (!activeY.value?.name) return []
  if (!activeX.value) activeX.value = xAxisListPredefined[0]

  chart.activeX = activeX.value?.name || ''
  chart.activeY = activeY.value?.name || ''
  chart.activeS = activeS.value?.name || ''

  let result = metricStore.metricData.filter(item => item.metric.name === activeY.value.name)

  if (activeY.value.type.includes('list')) {
    // preselect value for Series
    if (!activeS.value) activeS.value = seriesList.value[0]
    chart.activeS = activeS.value?.name

    const reducer = (acc: [], cr) => {
      const label = cr.label.find(l => l.name === activeS.value.name)

      const metricValue = cr.metric.value

      const arr = metricValue.map((y, index) => {
        let x = index

        if (activeX.value.value === 2) {
          x = new Date(cr.created)
        }

        if (activeX.value.value >= 3) {
          const iterationLabel = cr.label.find(l => l.name === activeX.value.name)
          x = iterationLabel?.value[index]
        }

        return { x, y, z: label.value }
      })

      acc.push(...arr)

      return acc
    }

    return result.reduce(reducer, [])
  } else {
    return result.map(({ label, metric, created }, index) => {
      let x = index
      let y = metric.value
      let z = undefined

      if (activeX.value.value === 2) {
        x = new Date(created)
      }

      if (activeX.value.value >= 3) {
        const xLabel = label.find(l => l.name === activeX.value.name)
        x = xLabel?.value || 0
      }

      if (activeS.value) {
        z = label.find(l => l.name === activeS.value.name)?.value
      }

      return { x, y, z }
    })
  }
})

const chartHeight = computed(() => {
  const h = height.value - 480
  return h > 425 ? 425 : h
})

const hadnleResetX = () => {
  setTimeout(() => (activeX.value = xAxisListPredefined[0]), 0)
}

const fetchData = async () => {
  await metricStore.getMetricData(suuid)
}

onBeforeMount(() => fetchData())
</script>
<style>
.l-chart .v-select__slot .v-input__icon--clear .v-icon {
  font-size: 18px;
}
.v-application--is-ltr .l-chart .v-input__append-inner {
  padding-left: 0;
}
</style>
