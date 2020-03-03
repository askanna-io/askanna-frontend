import { MutationTree } from 'vuex'
import { jobState } from './types'
import * as type from './types'

export const mutations: MutationTree<jobState> = {
  [type.SET_JOB](state, data) {
    state.job = data
  },

  [type.UPDATE_JOB](state, params) {
    state.job = Object.assign({}, state.job, params)
  },

  [type.UPDATE_JOB_RESULT](state, data) {
    state.result = data
  },

  [type.SET_RUN_JOB](state, data) {
    state.runs = data
  },

  [type.mutation.CLOSE_RESULT_MODAL](state) {
    state.openJobRunResult = false
  },

  [type.mutation.SET_RESULT_MODAL](state) {
    state.openJobRunResult = true
  }
}
