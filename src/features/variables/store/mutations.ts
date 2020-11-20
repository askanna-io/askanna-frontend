import { set } from 'lodash'
import * as type from './types'
import { MutationTree } from 'vuex'
import { VariablesState, VariableModel } from './types'

export const mutations: MutationTree<VariablesState> = {
  [type.mutation.SET_VARIABLES](state, data) {
    state.variables = data
  },

  [type.mutation.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  },

  [type.mutation.SET_VARIABLE_POPUP](state, value) {
    state.variablePopup = value
  },

  [type.mutation.SET_VARIABLE](state, { path, value }) {
    set(state.variable, path, value)
  },

  [type.mutation.SET_EDIT_VARIABLE](state, data) {
    state.variable = data
  },

  [type.mutation.RESET_VARIABLE](state) {
    state.variable = new VariableModel().state
  }
}
