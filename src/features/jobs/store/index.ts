import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { JobsState, JOBS_STORE } from './types'

export const state: JobsState = {
  jobs: []
}

const namespaced: boolean = true
export const name: string = JOBS_STORE
export const jobs: Module<JobsState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
