import { get, differenceWith, isEqual } from 'lodash'

export interface MetricItem {
  name: string
  type: string
  value: any
}

export interface RowItem {
  label: MetricItem[]
  metric: MetricItem[]
  variable?: MetricItem[]
  metricName: string
}

export interface MetricRowItem {
  label: MetricItem[]
  metric: MetricItem
  metricName: string
}

const emptyMetric = { name: '', type: '', value: '' }

export default ({
  count,
  allMetrics,
  itemName = 'metric'
}: {
  count: number
  allMetrics: MetricRowItem[]
  itemName: String
}) => {
  const result = [] as RowItem[]

  while (allMetrics.flatMap(item => item).length) {
    let item
    const labels = [] as MetricItem[]

    const metrics = []
    let metricName = ''

    for (let j = 0; j < count; j++) {
      // try to get always first element from array

      if (!item) {
        item = allMetrics[j].shift()
      }

      // set empty value
      if (!item) {
        metrics.push(emptyMetric)

        continue
      }

      // set metric name for row
      if (!metricName) {
        labels.push(...item.label)
        metrics.push(item[itemName])
        metricName = item[itemName].name

        allMetrics[j].splice(1, 0)

        continue
      }

      // try to find metric with the same name and labels
      const i = get(allMetrics, j).findIndex(el => {
        return el[itemName]?.name === metricName && !differenceWith(labels, el.label, isEqual).length
      })

      //  case on found
      if (i !== -1) {
        metrics.push(allMetrics[j][i][itemName])
        allMetrics[j].splice(i, 1)
      }

      // reset item if iteration end
      if (j === count - 1) {
        item = null
      }

      continue
    }

    result.push({ label: labels, metric: metrics, metricName })
  }

  return result
}
