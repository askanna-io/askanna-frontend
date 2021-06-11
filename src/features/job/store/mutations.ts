import { set } from 'lodash'
import * as type from './types'

import { MutationTree } from 'vuex'
import { jobState, JobModel, JobRunModel } from './types'

export const mutations: MutationTree<jobState> = {
  [type.SET_JOB](state, data) {
    state.job = data
  },

  [type.mutation.SET_JOB_RUN](state, data) {
    state.jobrun = { ...state.jobrun, ...data }
  },

  [type.UPDATE_JOB](state, params) {
    state.job = Object.assign({}, state.job, params)
  },

  [type.mutation.RESET_JOB_STORE](state) {
    state.result = ''
    state.job = new JobModel().state
    state.jobLoading = true
  },

  [type.mutation.RESET_JOB_RUN](state) {
    state.jobrun = new JobRunModel().state
  },

  [type.mutation.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  }
}
