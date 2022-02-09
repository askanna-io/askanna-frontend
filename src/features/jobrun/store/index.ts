import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { jobRunState, JOB_RUN_STORE, JobRunModel, ArtifactModel } from './types'

export const state: jobRunState = {
  runs: {
    count: 0,
    next: null,
    results: []
  },
  openJobRunResult: false,
  jobRun: new JobRunModel().state,
  jobRunPayload: undefined,
  jobRunLoading: true,
  payLoadLoading: false,
  jobRunsLoading: false,
  jobRunlogLoading: true,
  jobRunArtifactLoading: false,
  jobRunLog: {
    count: 0,
    next: null,
    results: []
  },
  jobRunLogFullVersion: [],
  jobRunlogScrollLoading: false,
  artifactData: new ArtifactModel().state
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
