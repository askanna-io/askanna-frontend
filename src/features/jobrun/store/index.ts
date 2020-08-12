import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { jobRunState, JOB_RUN_STORE, JobRunModel } from './types'

export const state: jobRunState = {
  runs: [],
  openJobRunResult: false,
  jobRun: new JobRunModel().state,
  jobRunPayload: null,
  jobRunLoading: true,
  resultLoading: true,
  payLoadLoading: true,
  jobRunlogLoading: true,
  jobRunResult: null,
  jobRunLog: {
    count: 0,
    next: null,
    results: []
  }
}

const namespaced: boolean = true
export const name: string = JOB_RUN_STORE
export const jobrun: Module<jobRunState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
