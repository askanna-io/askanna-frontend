import * as type from './types'
import { apiStringify } from '@/core/services/api-settings'
import * as rootTypes from '@/core/store/actionTypes'
import { logger } from '@/core/plugins/logger'

import { ActionTree } from 'vuex'
import { jobState, JOB_STORE } from './types'

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

    commit(type.mutation.UPDATE_JOB_RESULT, result.result!)
  },

  async [type.action.getJobInfo]({ dispatch, commit }, uuid) {
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

  async [type.updateJob]({ state: { job }, commit, dispatch }) {
    let updatedJob
    try {
      updatedJob = await dispatch(
        rootTypes.apiService,
        {
          action: api.update,
          method: 'put',
          serviceName,
          uuid: job.short_uuid,
          data: {
            name: job.name,
            title: job.title,
            description: job.description
          }
        },
        { root }
      )
      logger.success('Job was updated')
    } catch (e) {
      logger.error('Error on update job  in updateJob action.\nError: ', e)
      return
    }

    commit(type.UPDATE_JOB, updatedJob)
  },

  async [type.action.resetStore]({ commit }) {
    commit(type.mutation.RESET_JOB_STORE)
  },

  async [type.action.changeJob]({ commit }, data) {
    commit(type.UPDATE_JOB, data)
  }
}
