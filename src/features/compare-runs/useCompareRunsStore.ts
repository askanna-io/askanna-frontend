import { defineStore } from 'pinia'
import { set, map, uniqBy } from 'lodash'
import apiService from '@/core/services/apiService'
import { JobRun } from '@/features/jobrun/store/types'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'
import useMapMetrics, { MetricItem, MetricRowItem, RowItem } from './useMapMetrics'

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
      runs: { next: '', previous: '', count: 0, results: [] as JobRun[] },
      labels: [] as MetricItem[],
      metrics: [] as RowItem[],
      variables: [] as RowItem[],
      variableLabels: [] as MetricItem[],
      jobRunsLoading: true,
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
    async getMetric({ uuid, params }) {
      let metric

      try {
        metric = await apiService({
          uuid,
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
        map(this.runIds, async uuid => {
          const metric = await this.getMetric({
            uuid,
            params: { limit: 25, offset, ordering: ['metric.name', 'created'] }
          })

          if (metric.results) {
            return metric
          }
        })
      )
    },

    async getVariable({ uuid, params }) {
      let variable

      try {
        variable = await apiService({
          uuid,
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
        map(this.runIds, async uuid => {
          const metric = await this.getVariable({
            uuid,
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

    async getRunsJob({ uuid, params }) {
      this.jobRunsLoading = true

      let runs = {
        count: 0,
        next: '',
        previous: '',
        results: [] as JobRun[]
      }

      try {
        runs = await apiService({
          uuid,
          params,
          serviceName: 'job',
          action: jobApi.runs
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on runs job in getRunsJob action.\nError: ', e)
        this.jobRunsLoading = false

        return
      }

      this.runs = runs
      this.count = this.runs.results.length

      this.isInputExist = this.runs.results.some(item => item.payload)
      this.isMetricExist = this.runs.results.some(item => item.metrics_meta.count)
      this.isResultExist = this.runs.results.some(item => item.result)
      this.isArtifacExist = this.runs.results.some(item => item.artifact)
      this.isVariableExist = this.runs.results.some(item => item.variables_meta.count)

      this.runIds = runs.results.map(item => item.short_uuid)

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

      this.jobRunsLoading = false
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
