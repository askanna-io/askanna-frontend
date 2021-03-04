import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { metricState, METRIC_STORE } from './types'

export const state: metricState = {
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
  loading: {
    metric: false,
    metricJSON: false,
    metricByParams: false
  }
}

const namespaced: boolean = true
export const name: string = METRIC_STORE
export const metric: Module<metricState, RootState> = {
  state,
  getters,
  actions,
  mutations,
  namespaced
}
