import { set } from 'lodash'
import { defineStore } from 'pinia'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'

const logger = useLogger()
const serviceName = 'metric'

const apiActions = apiStringify(serviceName)

export const useMetricStore = defineStore('metric', {
  state: () => {
    return {
      metricMeta: {
        suuid: '',
        size: 0,
        count: 0,
        label_names: [],
        metric_names: []
      },
      isFiltered: false,
      metricData: [],
      metrics: {
        count: 0,
        next: null,
        results: []
      },
      metricFullData: '',
      metricLabels: [],
      metricJSON: {
        count: 0,
        next: null,
        results: []
      },
      loadingMeta: true,
      loading: {
        metric: false,
        metricJSON: false,
        metricByParams: false
      }
    }
  },
  getters: {
    isMetricBig() {
      return this.metricMeta.size > 5242880
    }
  },

  actions: {
    async getMetric({ uuid, params }) {
      let metric

      try {
        metric = await apiService({
          uuid,
          params,
          serviceName,
          action: apiActions.getMetric
        })
      } catch (e) {
        logger.error('Error on get metric in getMetric action.\nError: ', e)

        return
      }

      return metric
    },

    async getMetricInitial({ uuid, params, loading = 'metric' }) {
      set(this, loading, true)

      this.metrics = await this.getMetric({ uuid, params })

      set(this, loading, false)
    },

    async getMetricJSON({ uuid, params, loading = true }) {
      if (loading) this.loading.metricJSON = true

      const metric = await this.getMetric({ uuid, params })

      this.metricJSON = {
        next: metric.next,
        count: metric.count,
        results: [...this.metricJSON.results, ...metric.results]
      }

      this.loading.metricJSON = false
    },

    async getMetricFullData({ uuid }) {
      const metric = await this.getMetric({ uuid })

      this.metricFullData = JSON.stringify(metric, null, 2)
    },

    async getMetricByParams({ uuid, params, loading = false }) {
      if (loading) this.loading.metricByParams = true

      const metric = await this.getMetric({ uuid, params })

      this.metrics = {
        next: metric.next,
        count: metric.count,
        results: [...this.metrics.results, ...metric.results]
      }

      if (loading) this.loading.metricByParams = false
    },

    async getMetricMeta(uuid) {
      this.loadingMeta = true
      let runInfo

      try {
        runInfo = await apiService({
          uuid,
          serviceName,
          action: apiActions.getMetricMeta
        })
      } catch (e) {
        logger.error('Error on get metric in getMetric action.\nError: ', e)
        return
      }
      this.metricMeta = runInfo.metrics_meta
      this.loadingMeta = false
    },

    async getMetricData(uuid: string) {
      if (this.isMetricBig) return

      const params = {
        limit: 0
      }

      this.metricData = await this.getMetric({ uuid, params })
    }
  }
})
