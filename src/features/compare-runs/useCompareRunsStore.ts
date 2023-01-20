import { defineStore } from 'pinia'
import { set, map, uniqBy } from 'lodash'
import { Run } from '@/features/run/types'
import apiService from '@/services/apiService'
import { MetricItem, RowItem } from './useMapMetrics'
import { apiStringify } from '@/services/api-settings'

const logger = useLogger()
const runApi = apiStringify('run')
const metricApi = apiStringify('metric')
const variableApi = apiStringify('variable')

export const useCompareRunsStore = defineStore('compare-runs', {
  state: () => {
    return {
      count: 5,
      selectedCount: 15,
      isInputExist: false,
      isMetricExist: false,
      isResultExist: false,
      isArtifacExist: false,
      isVariableExist: false,
      runs: { next: '', previous: '', count: 0, results: [] as Run[] },
      labels: [] as MetricItem[],
      metrics: [] as RowItem[],
      variables: [] as RowItem[],
      variableLabels: [] as MetricItem[],
      runIdsLoading: true,
      runIds: [] as string[],
      metricParams: {
        maxCount: 0,
        next: new Map(),
        loadMetrics: false
      },
      variableParams: {
        maxCount: 0,
        next: new Map(),
        loadVariable: false
      }
    }
  },

  actions: {
    async getMetric({ suuid, params }) {
      let metric

      try {
        metric = await apiService({
          suuid,
          params,
          serviceName: 'metric',
          action: metricApi.getMetric
        })
      } catch (e) {
        logger.error('Error on get metric in getMetric action.\nError: ', e)

        return
      }

      return metric
    },

    async getMetrics() {
      return await Promise.all(
        map(this.runIds, async (suuid) => {
          let cursor = null
          const next = this.metricParams.next.get(suuid)

          if (next) {
            const url = new URL(next)
            cursor = url.searchParams.get('cursor')
          }

          const metric = await this.getMetric({
            suuid,
            params: { cursor, page_size: 25, order_by: 'metric.name, created' }
          })

          if (!metric?.next) this.metricParams.next.delete(suuid)
          if (metric?.next) this.metricParams.next.set(suuid, metric.next)

          if (metric?.results) return metric
        })
      )
    },

    async getVariable({ suuid, params }) {
      let variable

      try {
        variable = await apiService({
          suuid,
          params,
          serviceName: 'variable',
          action: variableApi.getVariables
        })
      } catch (e) {
        logger.error('Error on get variable in getVariable action.\nError: ', e)

        return
      }

      return variable
    },

    async getVariables() {
      return await Promise.all(
        map(this.runIds, async (suuid) => {
          let cursor = null
          const next = this.variableParams.next.get(suuid)

          if (next) {
            const url = new URL(next)
            cursor = url.searchParams.get('cursor')
          }

          const metric = await this.getVariable({
            suuid,
            params: { cursor, page_size: 25, order_by: 'variable.name, created' }
          })

          if (!metric?.next) this.variableParams.next.delete(suuid)
          if (metric?.next) this.variableParams.next.set(suuid, metric.next)

          if (metric.results) return metric
        })
      )
    },

    mapMetrics(allResults, itemName = 'metric') {
      const params = `${itemName}Params`

      set(this, [params, 'maxCount'], Math.max(...allResults.map((item) => item.results.length)))

      const allMetrics = [...allResults.map((item) => item.results)]
      const result = useMapMetrics({ count: this.count, allMetrics, itemName })

      return result
    },

    async getRunsJob({ suuid, params }) {
      this.runIdsLoading = true

      let runs = {
        count: 0,
        next: '',
        previous: '',
        results: [] as Run[]
      }

      try {
        runs = await apiService({
          serviceName: 'run',
          action: runApi.list,
          params: { ...params, job_suuid: suuid }
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on runs job in getRunsJob action.\nError: ', e)
        this.runIdsLoading = false

        return
      }

      this.runs = runs
      this.count = this.runs.results.length

      this.isInputExist = this.runs.results.some((item) => item.payload)
      this.isMetricExist = this.runs.results.some((item) => item.metrics_meta.count)
      this.isResultExist = this.runs.results.some((item) => item.result)
      this.isArtifacExist = this.runs.results.some((item) => item.artifact)
      this.isVariableExist = this.runs.results.some((item) => item.variables_meta.count)

      this.runIds = runs.results.map((item) => item.suuid)

      // get metrics
      if (this.isMetricExist) {
        // get all uniqe metric labels
        const labels = this.runs.results.flatMap((cr) => cr.metrics_meta.label_names)

        this.labels = uniqBy(labels, 'name')

        const allResults = await this.getMetrics()

        const result = this.mapMetrics(allResults)

        this.metrics = [...this.metrics, ...result]
      }

      // get variable
      if (this.isVariableExist) {
        // get all uniqe variable labels
        const variableLabels = this.runs.results.flatMap((cr) => cr.variables_meta.label_names)

        this.variableLabels = uniqBy(variableLabels, 'name')

        const allVariableResults = await this.getVariables()

        const resultVariable = this.mapMetrics(allVariableResults, 'variable')

        this.variables = [...this.variables, ...resultVariable]
      }

      this.runIdsLoading = false
    },

    async loadMoreMetrics() {
      this.metricParams.loadMetrics = true

      const allResults = await this.getMetrics()
      const result = this.mapMetrics(allResults)

      this.metrics = [...this.metrics, ...result]

      this.metricParams.loadMetrics = false
    },

    async loadMoreVariables() {
      this.variableParams.loadVariable = true

      const allResults = await this.getVariables()
      const result = this.mapMetrics(allResults, 'variable')

      this.variables = [...this.variables, ...result]

      this.variableParams.loadVariable = false
    }
  }
})
