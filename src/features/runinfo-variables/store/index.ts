import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { runInfoVariablesState, RUNIFO_VARIABLES_STORE } from './types'

export const state: runInfoVariablesState = {
  isFiltered: false,
  variables: {
    count: 0,
    next: null,
    results: []
  },
  variablesFullData: '',
  variablesLabels: [],
  variablesJSON: {
    count: 0,
    next: null,
    results: []
  },
  loading: {
    variables: false,
    variablesJSON: false,
    variablesByParams: false
  }
}

const namespaced: boolean = true
export const name: string = RUNIFO_VARIABLES_STORE
export const runinfoVariables: Module<runInfoVariablesState, RootState> = {
  state,
  getters,
  actions,
  mutations,
  namespaced
}
