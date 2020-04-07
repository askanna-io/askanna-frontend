import { MutationTree } from 'vuex'
import { jobRunState } from './types'
import * as type from './types'

export const mutations: MutationTree<jobRunState> = {
  [type.SET_JOB_RUN](state, data) {
    state.jobRun = data
  },

  [type.SET_JOB_RUNS](state, data) {
    state.runs = data
  },

  [type.mutation.CLOSE_RESULT_MODAL](state) {
    state.openJobRunResult = false
  },

  [type.mutation.SET_RESULT_MODAL](state) {
    state.openJobRunResult = true
  },

  [type.SET_JOB_RUN_PAYLOAD](state, data) {
    state.jobRunPayload = data
  }
}
