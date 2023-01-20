<template>
  <div>
    <div id="chart" class="text-center"></div>
    <div id="chart-legend" v-html="chartLegendRef" class="text-center px-3"></div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import { get } from 'lodash'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  height: {
    type: Number,
    default: 550
  },
  xAxis: {
    type: Object,
    default: () => {}
  },
  yAxis: {
    type: Object,
    default: () => {}
  }
})

const chartLegendRef = ref('')

const chart = useChartStore()
const lineChart = useLineChart()
const chartLegend = useChartLegend()

watch(
  () => props.data,
  data => {
    lineChart.clean('chart')
    chartLegendRef.value = ''

    if (!data.length) return

    chart.svgData = lineChart.render(data, {
      id: 'chart',
      x: d => d.x,
      y: d => d.y,
      z: d => d.z,
      width: 900,
      yLabel: props.yAxis.name,
      xLabel: props.xAxis.name,
      height: props.height,
      xType: get(d3, props.xAxis.xType),
      xTitle: props.xAxis.title,
      yTitle: props.yAxis.name
    })

    const legendData = data.map(item => item.z).filter(item => item)
    if (!legendData.length) return

    chartLegendRef.value = chartLegend.swatches(legendData, {
      columns: '180px'
    })
  }
)
</script>
