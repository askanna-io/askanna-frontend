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
  resultLoading: true,
  payLoadLoading: false,
  jobRunsLoading: false,
  jobRunlogLoading: true,
  jobRunArtifactLoading: true,
  jobRunResult: '',
  jobRunLog: {
    count: 0,
    next: null,
    results: []
  },
  jobRunLogFullVersion: [],
  artifactData: new ArtifactModel().state,
  file: '',
  fileSource: new Blob()
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
