import { MutationTree } from 'vuex'
import { JobRunModel, jobRunState } from './types'
import * as type from './types'
import { set } from 'lodash'

export const mutations: MutationTree<jobRunState> = {
  [type.SET_JOB_RUN](state, data) {
    state.jobRun = data
  },

  [type.SET_JOB_RUNS](state, data) {
    const runs = data.sort((a: any, b: any) => {
      const dateA = new Date(a.created)
      const dateB = new Date(b.created)

      return dateB.getTime() - dateA.getTime()
    })
    state.runs = runs
  },

  [type.mutation.CLOSE_RESULT_MODAL](state) {
    state.openJobRunResult = false
  },

  [type.mutation.SET_RESULT_MODAL](state) {
    state.openJobRunResult = true
  },

  [type.SET_JOB_RUN_PAYLOAD](state, data) {
    state.jobRunPayload = data
  },

  [type.SET_JOB_RUN_RESULT](state, data) {
    state.jobRunResult = data
  },

  [type.mutation.UPDATE_JOB_RUN_STORE](state) {
    state.runs = []
    state.jobRunResult = null
    state.jobRunPayload = null
    state.jobRunLoading = true
    state.resultLoading = true
    state.payLoadLoading = true
    state.jobRun = new JobRunModel().state
  },

  [type.mutation.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  },

  [type.SET_JOB_RUN_LOG](state, { count, next, results: list }) {
    state.jobRunLog = {
      next,
      count,
      results: [...state.jobRunLog.results, ...list]
    }
  }
}
