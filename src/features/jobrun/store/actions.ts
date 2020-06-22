import * as type from './types'
import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'
import { jobRunState, JobRun, JOB_RUN_STORE, stateType } from './types'

const serviceName = JOB_RUN_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<jobRunState, RootState> = {
  async [type.action.getRunsJob]({ commit }, uuid) {
    let runs: JobRun[]
    try {
      runs = await apiService({
        action: api.runs,
        method: 'get',
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on runs job  in getRunsJob action.\nError: ', e)

      return
    }

    commit(type.SET_JOB_RUNS, runs)
  },

  async [type.action.resetStore]({ commit }) {
    commit(type.mutation.UPDATE_JOB_RUN_STORE)
  },

  [type.action.showJobRunResult]({ commit }) {
    commit(type.mutation.SET_RESULT_MODAL)
  },
  [type.action.closeResultModal]({ commit }) {
    commit(type.mutation.CLOSE_RESULT_MODAL)
  },

  async [type.action.getJobRun]({ commit }, uuid) {
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunLoading, value: true })

    let jobRun = {}
    try {
      jobRun = await apiService({
        action: api.getJobRun,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on jobRun job  in getJobRun action.\nError: ', e)

      return
    }

    commit(type.SET_JOB_RUN, jobRun)
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunLoading, value: false })
  },

  async [type.action.getJobRunPayload]({ commit }, uuid) {
    commit(type.mutation.SET_LOADING, { name: stateType.payLoadLoading, value: true })

    let jobRunPayload = {}
    try {
      jobRunPayload = await apiService({
        action: api.getJobRunPayload,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on jobRunPayload job  in getJobRunPayload action.\nError: ', e)

      return
    }
    commit(type.SET_JOB_RUN_PAYLOAD, jobRunPayload)
    commit(type.mutation.SET_LOADING, { name: stateType.payLoadLoading, value: false })
  },

  async [type.action.getJobRunResult]({ commit }, uuid) {
    commit(type.mutation.SET_LOADING, { name: stateType.resultLoading, value: true })

    let jobRunResult = null
    try {
      jobRunResult = await apiService({
        action: api.getJobRunResult,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on jobRunResult job  in getJobRunResult action.\nError: ', e)
    }
    commit(type.SET_JOB_RUN_RESULT, jobRunResult)
    commit(type.mutation.SET_LOADING, { name: stateType.resultLoading, value: false })
  }
}
