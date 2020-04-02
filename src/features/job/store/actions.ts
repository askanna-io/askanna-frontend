import * as type from './types'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'
import { logger } from '@/core/plugins/logger'

import { ActionTree } from 'vuex'
import { jobState, JobRun, JOB_STORE } from './types'

const root = true
const serviceName = JOB_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<jobState, RootState> = {
  async [type.action.getJob]({ commit, dispatch }, id) {
    let job
    try {
      job = await dispatch(
        rootTypes.apiService,
        {
          action: api.get,
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load job  in getJob action.\nError: ', e)
      return
    }

    commit(type.SET_JOB, job)
  },

  async [type.startJob]({ commit, dispatch }, id) {
    let job
    try {
      job = await dispatch(
        rootTypes.apiService,
        {
          action: api.start,
          method: 'post',
          serviceName,
          uuid: id
        },
        { root }
      )
      logger.success('Job was started')
    } catch (e) {
      logger.error('Error on start job  in startJob action.\nError: ', e)
      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.stopJob]({ commit, dispatch }, id) {
    let job
    try {
      job = await dispatch(
        rootTypes.apiService,
        {
          action: api.stop,
          method: 'post',
          serviceName,
          uuid: id
        },
        { root }
      )
      logger.userDanger('Job was stoped')
    } catch (e) {
      logger.error('Error on stop job  in stopJob action.\nError: ', e)

      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.pauseJob]({ commit, dispatch }, id) {
    let job
    try {
      job = await dispatch(
        rootTypes.apiService,
        {
          action: api.pause,
          method: 'post',
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on pause job  in pauseJob action.\nError: ', e)

      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.resetJob]({ commit, dispatch }, id) {
    let job
    try {
      job = await dispatch(
        rootTypes.apiService,
        {
          action: api.reset,
          method: 'post',
          serviceName,
          uuid: id
        },
        { root }
      )
      logger.userWarning('Job was reseted')
    } catch (e) {
      logger.error('Error on reset job  in resetJob action.\nError: ', e)

      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.killJob]({ commit, dispatch }, id) {
    let job
    try {
      job = await dispatch(
        rootTypes.apiService,
        {
          action: api.kill,
          method: 'post',
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on kill job  in killJob action.\nError: ', e)

      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.resultJob]({ commit, dispatch }, id) {
    let result
    try {
      result = await dispatch(
        rootTypes.apiService,
        {
          action: api.result,
          method: 'post',
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on result job  in resultJob action.\nError: ', e)

      return
    }

    commit(type.UPDATE_JOB_RESULT, result.result!)
  },

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

    commit(type.SET_RUN_JOB, runs)
  },

  async [type.action.getJobInfo]({ dispatch }, uuid) {
    let info = {}
    try {
      info = await dispatch(
        rootTypes.apiService,
        {
          action: api.info,
          method: 'post',
          serviceName,
          uuid
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on info job  in getJobInfo action.\nError: ', e)

      return
    }

    return info
  },

  async [type.action.resetStore]({ commit }) {
    commit(type.UPDATE_JOB_RESULT, '')
  },

  [type.action.showJobRunResult]({ commit }, params) {
    commit(type.mutation.SET_RESULT_MODAL, params)
  },
  [type.action.closeResultModal]({ commit }) {
    commit(type.mutation.CLOSE_RESULT_MODAL)
  }
}
