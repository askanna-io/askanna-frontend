import { MutationTree } from 'vuex'
import { jobState, JobModel } from './types'
import * as type from './types'
import { stateType } from '@/features/jobrun/store/types'

export const mutations: MutationTree<jobState> = {
  [type.SET_JOB](state, data) {
    state.job = data
  },

  [type.UPDATE_JOB](state, params) {
    state.job = Object.assign({}, state.job, params)
  },

  [type.mutation.RESET_JOB_STORE](state, params) {
    state.result = ''
    state.job = new JobModel().state
  }
}
