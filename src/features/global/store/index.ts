import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { GlobalState, globalStoreName } from './types'

export const state: GlobalState = {
  snackbar: {
    open: false,
    message: '',
    timeout: 6000,
    top: true,
    right: true,
    left: false,
    bottom: false,
    multiLine: true
  }
}

const namespaced: boolean = true

export const name = globalStoreName
export const global: Module<GlobalState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
