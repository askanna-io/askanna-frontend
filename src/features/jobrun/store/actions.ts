import * as type from './types'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'
import { logger } from '@/core/plugins/logger'

import { ActionTree } from 'vuex'
import { jobRunState, JobRun, JOB_RUN_STORE } from './types'

const root = true
const serviceName = JOB_RUN_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<jobRunState, RootState> = {
  async [type.action.getRunsJob]({ commit, dispatch }, id) {
    let runs: JobRun[]
    try {
      runs = await dispatch(
        rootTypes.apiService,
        {
          action: api.runs,
          method: 'get',
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on runs job  in getRunsJob action.\nError: ', e)

      return
    }

    runs = runs.sort((a, b) => {
      const dateA = new Date(a.created)
      const dateB = new Date(b.created)

      return dateB.getTime() - dateA.getTime()
    })

    commit(type.SET_JOB_RUNS, runs)
  },

  async [type.action.resetStore]({ commit }) {
    commit(type.mutation.UPDATE_JOB_RUN_STORE)
  },

  [type.action.showJobRunResult]({ commit }, params) {
    commit(type.mutation.SET_RESULT_MODAL, params)
  },
  [type.action.closeResultModal]({ commit }) {
    commit(type.mutation.CLOSE_RESULT_MODAL)
  },

  async [type.action.getJobRun]({ dispatch, commit }, uuid) {
    let jobRun = {}
    try {
      jobRun = await dispatch(
        rootTypes.apiService,
        {
          action: api.getJobRun,
          serviceName,
          uuid
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on jobRun job  in getJobRun action.\nError: ', e)

      return
    }

    commit(type.SET_JOB_RUN, jobRun)
  },

  async [type.action.getJobRunPayload]({ dispatch, commit }, uuid) {
    let jobRunPayload = {}
    try {
      jobRunPayload = await dispatch(
        rootTypes.apiService,
        {
          action: api.getJobRunPayload,
          serviceName,
          uuid
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on jobRunPayload job  in getJobRunPayload action.\nError: ', e)

      return
    }

    commit(type.SET_JOB_RUN_PAYLOAD, jobRunPayload)
  }
}
