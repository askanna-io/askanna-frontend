import { get, map } from 'lodash'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { api, apiStringify } from '@/core/services/api-settings'

import { metricState, METRIC_STORE, stateType, action as ac, mutation as mt } from './types'

const serviceName = METRIC_STORE
const apiActions = apiStringify(serviceName)

export const actions: ActionTree<metricState, RootState> = {
  async [ac.getMetric]({ commit }, { uuid, params }) {
    let metric

    try {
      metric = await apiService({
        uuid,
        params,
        serviceName,
        action: apiActions.getMetric
      })
    } catch (e) {
      logger.error(commit, 'Error on get metric in getMetric action.\nError: ', e)

      return
    }

    return metric
  },

  async [ac.getMetricInitial]({ commit, dispatch }, { uuid, params, loading = 'metric' }) {
    commit(mt.SET_LOADING, { [loading]: true })

    const metric = await dispatch(ac.getMetric, { uuid, params })

    commit(mt.SET_METRIC_INIT, metric)
    commit(mt.SET_LOADING, { [loading]: false })
  },

  async [ac.getMetricJSON]({ commit, dispatch }, { uuid, params, loading = true }) {
    if (loading) commit(mt.SET_LOADING, { metricJSON: true })

    const metric = await dispatch(ac.getMetric, { uuid, params })

    commit(mt.SET_METRIC_JSON, metric)
    if (loading) commit(mt.SET_LOADING, { metricJSON: false })
  },

  async [ac.getMetricFullData]({ commit, dispatch }, { uuid, loading = false }) {
    const metric = await dispatch(ac.getMetric, { uuid })

    commit(mt.SET_METRIC_FULL_DATA, metric)
  },

  async [ac.getMetricByParams]({ commit, dispatch }, { uuid, params, loading = false }) {
    if (loading) commit(mt.SET_LOADING, { metricByParams: true })

    const metric = await dispatch(ac.getMetric, { uuid, params })

    commit(mt.SET_METRIC, metric)
    if (loading) commit(mt.SET_LOADING, { metricByParams: false })
  },

  async [ac.getMetricLabels]({ commit }, uuid) {
    let meta

    try {
      meta = await apiService({
        uuid,
        serviceName,
        action: apiActions.getMetricMeta
      })
    } catch (e) {
      logger.error(commit, 'Error on get metric in getMetric action.\nError: ', e)
      return
    }

    commit(mt.SET_METRIC_LABELS, meta?.labels)
  },

  async [ac.setLoading]({ commit }, data) {
    commit(mt.SET_LOADING, data)
  },

  async [ac.setIsFiltered]({ commit }, val) {
    commit(mt.SET_IS_FILTERED, val)
  }
}
