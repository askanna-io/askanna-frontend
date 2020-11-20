import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { VariablesState, VARIABLES_STORE, VariableModel } from './types'

export const state: VariablesState = {
  variable: new VariableModel().state,
  variables: [],
  variablePopup: false,
  variablesLoading: true,
  variableConfirmDeletePopup: false
}

const namespaced: boolean = true
export const name: string = VARIABLES_STORE
export const variables: Module<VariablesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
