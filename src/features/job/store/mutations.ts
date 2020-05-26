import * as type from './types'
import { MutationTree } from 'vuex'
import { jobState, JobModel } from './types'

export const mutations: MutationTree<jobState> = {
  [type.SET_JOB](state, data) {
    state.job = data
  },

  [type.UPDATE_JOB](state, params) {
    state.job = Object.assign({}, state.job, params)
  },

  [type.mutation.RESET_JOB_STORE](state) {
    state.result = ''
    state.job = new JobModel().state
  }
}
