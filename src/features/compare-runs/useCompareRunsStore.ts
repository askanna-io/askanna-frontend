import { defineStore } from 'pinia'
import { set, map, uniqBy } from 'lodash'
import { Run } from '@/features/run/types'
import apiService from '@/services/apiService'
import { MetricItem, RowItem } from './useMapMetrics'
import { apiStringify } from '@/services/api-settings'

const logger = useLogger()
const jobApi = apiStringify('job')
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
        next: '',
        offset: 0,
        maxCount: 0,
        loadMetrics: false
      },
      variableParams: {
        next: '',
        offset: 0,
        maxCount: 0,
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

    async getMetrics({ offset }) {
      return await Promise.all(
        map(this.runIds, async suuid => {
          const metric = await this.getMetric({
            suuid,
            params: { limit: 25, offset, ordering: ['metric.name', 'created'] }
          })

          if (metric.results) {
            return metric
          }
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

    async getVariables({ offset }) {
      return await Promise.all(
        map(this.runIds, async suuid => {
          const metric = await this.getVariable({
            suuid,
            params: { limit: 25, offset, ordering: ['variable.name', 'created'] }
          })

          if (metric.results) {
            return metric
          }
        })
      )
    },

    mapMetrics(allResults, itemName = 'metric') {
      const params = `${itemName}Params`

      set(
        this,
        [params, 'next'],
        allResults.some(item => item?.next)
      )
      set(this, [params, 'maxCount'], Math.max(...allResults.map(item => item.results.length)))

      const allMetrics = [...allResults.map(item => item.results)]
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
          suuid,
          params,
          serviceName: 'job',
          action: jobApi.runs
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on runs job in getRunsJob action.\nError: ', e)
        this.runIdsLoading = false

        return
      }

      this.runs = runs
      this.count = this.runs.results.length

      this.isInputExist = this.runs.results.some(item => item.payload)
      this.isMetricExist = this.runs.results.some(item => item.metrics_meta.count)
      this.isResultExist = this.runs.results.some(item => item.result)
      this.isArtifacExist = this.runs.results.some(item => item.artifact)
      this.isVariableExist = this.runs.results.some(item => item.variables_meta.count)

      this.runIds = runs.results.map(item => item.suuid)

      // get metrics
      if (this.isMetricExist) {
        // get all uniqe metric labels
        const labels = this.runs.results.flatMap(cr => cr.metrics_meta.label_names)

        this.labels = uniqBy(labels, 'name')

        const allResults = await this.getMetrics({ offset: 0 })

        const result = this.mapMetrics(allResults)

        this.metrics = [...this.metrics, ...result]
      }

      // get variable
      if (this.isVariableExist) {
        // get all uniqe variable labels
        const variableLabels = this.runs.results.flatMap(cr => cr.variables_meta.label_names)

        this.variableLabels = uniqBy(variableLabels, 'name')

        const allVariableResults = await this.getVariables({ offset: 0 })

        const resultVariable = this.mapMetrics(allVariableResults, 'variable')

        this.variables = [...this.variables, ...resultVariable]
      }

      this.runIdsLoading = false
    },

    async loadMoreMetrics() {
      this.metricParams.loadMetrics = true
      this.metricParams.offset = this.metricParams.offset + 25

      const allResults = await this.getMetrics({ offset: this.metricParams.offset })
      const result = this.mapMetrics(allResults)

      this.metrics = [...this.metrics, ...result]

      this.metricParams.loadMetrics = false
    },

    async loadMoreVariables() {
      this.variableParams.loadVariable = true
      this.variableParams.offset = this.variableParams.offset + 25

      const allResults = await this.getVariables({ offset: this.variableParams.offset })
      const result = this.mapMetrics(allResults, 'variable')

      this.variables = [...this.variables, ...result]

      this.variableParams.loadVariable = false
    }
  }
})
