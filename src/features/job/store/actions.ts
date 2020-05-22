import * as type from './types'
import { ActionTree } from 'vuex'
import { jobState, JOB_STORE } from './types'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'

const serviceName = JOB_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<jobState, RootState> = {
  async [type.action.getJob]({ commit }, id) {
    let job
    try {
      job = await apiService({
        action: api.get,
        serviceName,
        uuid: id
      })
    } catch (error) {
      logger.error(commit, 'Error on load job  in getJob action.\nError: ', error)
      return
    }

    commit(type.SET_JOB, job)
  },

  async [type.startJob]({ commit }, uuid) {
    let job
    try {
      job = await apiService({
        action: api.start,
        method: 'post',
        serviceName,
        uuid
      })
    } catch (e) {
      console.log(e)
      logger.error(commit, 'Error on start job  in startJob action.\nError: ', e)
      return
    }
    logger.success(commit, 'Job was started')

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.stopJob]({ commit }, id) {
    let job
    try {
      job = await apiService({
        action: api.stop,
        method: 'post',
        serviceName,
        uuid: id
      })
    } catch (e) {
      logger.error(commit, 'Error on stop job  in stopJob action.\nError: ', e)

      return
    }
    logger.userDanger(commit, 'Job was stoped')
    commit(type.UPDATE_JOB, job)
  },

  async [type.action.pauseJob]({ commit }, id) {
    let job
    try {
      job = await apiService({
        action: api.pause,
        method: 'post',
        serviceName,
        uuid: id
      })
    } catch (e) {
      logger.error(commit, 'Error on pause job  in pauseJob action.\nError: ', e)

      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.resetJob]({ commit }, id) {
    let job
    try {
      job = await apiService({
        action: api.reset,
        method: 'post',
        serviceName,
        uuid: id
      })
    } catch (e) {
      logger.error(commit, 'Error on reset job  in resetJob action.\nError: ', e)

      return
    }
    logger.userWarning(commit, 'Job was reseted')
    commit(type.UPDATE_JOB, job)
  },

  async [type.action.killJob]({ commit }, id) {
    let job
    try {
      job = await apiService({
        action: api.kill,
        method: 'post',
        serviceName,
        uuid: id
      })
    } catch (e) {
      logger.error(commit, 'Error on kill job  in killJob action.\nError: ', e)

      return
    }

    commit(type.UPDATE_JOB, job)
  },

  async [type.action.resultJob]({ commit }, id) {
    let result
    try {
      result = await apiService({
        action: api.result,
        method: 'post',
        serviceName,
        uuid: id
      })
    } catch (e) {
      logger.error(commit, 'Error on result job  in resultJob action.\nError: ', e)

      return
    }

    commit(type.mutation.UPDATE_JOB_RESULT, result.result!)
  },

  async [type.action.getJobInfo]({ commit }, uuid) {
    let info = {}
    try {
      info = await apiService({
        action: api.info,
        method: 'post',
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on info job  in getJobInfo action.\nError: ', e)

      return
    }

    return info
  },

  async [type.updateJob]({ state: { job }, commit }) {
    let updatedJob
    try {
      updatedJob = await apiService({
        action: api.update,
        method: 'put',
        serviceName,
        uuid: job.short_uuid,
        data: {
          name: job.name,
          title: job.title,
          description: job.description
        }
      })
    } catch (e) {
      logger.error(commit, 'Error on update job  in updateJob action.\nError: ', e)
      return
    }
    logger.success(commit, 'Job was updated')
    commit(type.UPDATE_JOB, updatedJob)
  },

  async [type.action.resetStore]({ commit }) {
    commit(type.mutation.RESET_JOB_STORE)
  },

  async [type.action.changeJob]({ commit }, data) {
    commit(type.UPDATE_JOB, data)
  }
}
