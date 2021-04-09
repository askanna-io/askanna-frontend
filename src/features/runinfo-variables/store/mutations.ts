import { mutation } from './types'
import { MutationTree } from 'vuex'
import { runInfoVariablesState } from './types'

export const mutations: MutationTree<runInfoVariablesState> = {
  [mutation.SET_VARIABLES_INIT](state, data) {
    state.variables = data
  },

  [mutation.SET_VARIABLES](state, { count, results, next }) {
    state.variables = {
      next,
      count,
      results: [...state.variables.results, ...results]
    }
  },

  [mutation.SET_VARIABLES_JSON](state, { count, results, next }) {
    state.variablesJSON = {
      next,
      count,
      results: [...state.variablesJSON.results, ...results]
    }
  },

  [mutation.SET_VARIABLES_FULL_DATA](state, data) {
    state.variablesFullData = JSON.stringify(data, null, 2)
  },

  [mutation.SET_VARIABLES_LABELS](state, data) {
    state.variablesLabels = data
  },

  [mutation.SET_LOADING](state, value) {
    state.loading = { ...state.loading, ...value }
  },

  [mutation.SET_IS_FILTERED](state, value) {
    state.isFiltered = value
  }
}
