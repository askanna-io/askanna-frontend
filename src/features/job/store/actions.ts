import * as type from './types'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'
import { logger } from '@/core/plugins/logger'

import { ActionTree } from 'vuex'
import { JobModel, jobState, JOB_STORE } from './types'

const root = true
const serviceName = JOB_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<jobState, RootState> = {
  async [type.action.getJob]({ commit, dispatch, state }, id) {
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

  async [type.startJob]({ commit, dispatch, state }, id) {
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
    } catch (e) {
      logger.error('Error on start job  in startJob action.\nError: ', e)
      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.stopJob]({ commit, dispatch, state }, id) {
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
    } catch (e) {
      logger.error('Error on stop job  in stopJob action.\nError: ', e)

      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.pauseJob]({ commit, dispatch, state }, id) {
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

  async [type.action.resetJob]({ commit, dispatch, state }, id) {
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
    } catch (e) {
      logger.error('Error on reset job  in resetJob action.\nError: ', e)

      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.killJob]({ commit, dispatch, state }, id) {
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

  async [type.action.resultJob]({ commit, dispatch, state }, id) {
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

  async [type.action.resetStore]({ commit }) {
    commit(type.UPDATE_JOB_RESULT, '')
  }
}
