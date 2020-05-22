import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { loggerState, LOGGER_STORE } from './types'

export const state: loggerState = {
  snackBar: true,
  consoleLog: true,
  development: true,
  production: false
}

const namespaced: boolean = true
export const name: string = LOGGER_STORE
export const logger: Module<loggerState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
