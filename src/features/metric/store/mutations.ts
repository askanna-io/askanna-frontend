import { set } from 'lodash'
import { mutation } from './types'
import { MutationTree } from 'vuex'
import { metricState } from './types'

export const mutations: MutationTree<metricState> = {
  [mutation.SET_METRIC_INIT](state, data) {
    state.metrics = data
  },

  [mutation.SET_METRIC](state, { count, results, next }) {
    state.metrics = {
      next,
      count,
      results: [...state.metrics.results, ...results]
    }
  },

  [mutation.SET_METRIC_JSON](state, { count, results, next }) {
    state.metricJSON = {
      next,
      count,
      results: [...state.metricJSON.results, ...results]
    }
  },

  [mutation.SET_METRIC_FULL_DATA](state, data) {
    state.metricFullData = JSON.stringify(data, null, 2)
  },

  [mutation.SET_METRIC_LABELS](state, data) {
    state.metricLabels = data
  },

  [mutation.SET_LOADING](state, value) {
    state.loading = { ...state.loading, ...value }
  },

  [mutation.SET_IS_FILTERED](state, value) {
    state.isFiltered = value
  }
}
