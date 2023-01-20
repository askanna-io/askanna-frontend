import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const logger = useLogger()
const serviceName = 'metric'

const apiActions = apiStringify(serviceName)

export const useMetricStore = defineStore('metric', {
  state: () => {
    return {
      metricMeta: {
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
        results: [],
        previous: null
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
        metricByParams: true
      }
    }
  },
  getters: {
    isMetricBig() {
      return this.metricMeta.size > 5242880
    }
  },

  actions: {
    async getMetric({ suuid, params }) {
      let metric

      try {
        metric = await apiService({
          suuid,
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

    async getMetricJSON({ suuid, params, loading = true }) {
      if (loading) this.loading.metricJSON = true

      const metric = await this.getMetric({ suuid, params })

      this.metricJSON = {
        next: metric.next,
        count: metric.count,
        results: [...this.metricJSON.results, ...metric.results]
      }

      this.loading.metricJSON = false
    },

    async getMetricFullData({ suuid }) {
      const metric = await this.getMetric({ suuid })

      this.metricFullData = JSON.stringify(metric, null, 2)
    },

    async getMetricByParams({ loading, params, initial, suuid } = { loading: true, params: {}, initial: false, suuid: '' }) {
      if (loading) this.loading.metricByParams = true

      const data = await this.getMetric({ suuid, params })

      this.metrics = initial ? data : { ...data, results: [...this.metrics.results, ...data.results] }

      this.loading.metricByParams = false
    },

    getMetricMeta() {
      this.loadingMeta = true
      const runStore = useRunStore()

      this.metricMeta = runStore.run.metrics_meta
      this.loadingMeta = false
    },

    async getMetricData(suuid: string) {
      if (this.isMetricBig) return

      const params = {
        paga_size: 10000
      }

      const data = await this.getMetric({ suuid, params })
      this.metricData = data?.results
    }
  }
})
