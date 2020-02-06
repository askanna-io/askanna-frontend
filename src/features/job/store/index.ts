import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { jobState, JOB_STORE } from './types'

export const state: jobState = {
  job: {}
}

const namespaced: boolean = true
export const name: string = JOB_STORE
export const job: Module<jobState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
