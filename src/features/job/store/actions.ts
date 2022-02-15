import * as type from './types'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import VueRouter from 'vue-router'
import { jobState, JOB_STORE, stateType } from './types'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'
const { isNavigationFailure, NavigationFailureType } = VueRouter
import { mutation as gMutation, GENERAL_STORE } from '@/core/store/general/types'

const serviceName = JOB_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<jobState, RootState> = {
  async [type.action.getJob]({ commit }, id) {
    commit(type.mutation.SET_LOADING, { name: stateType.jobLoading, value: true })

    let job
    try {
      job = await apiService({
        action: api.get,
        serviceName,
        uuid: id
      })
    } catch (error) {
      logger.error(commit, 'Error on load job  in getJob action.\nError: ', error)

      router.push({ name: 'workspace-project-job-does-not-exist' }).catch(failure => {
        if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
          logger.error(commit, 'Error on redirect to workspace-project-job-does-not-exist.\nError: ', failure)
        }
      })

      return
    }

    commit(type.SET_JOB, job)
    commit(`${GENERAL_STORE}/${gMutation.SET_BREADCRUMB_PARAMS}`, { jobId: job.name }, { root: true })
    commit(type.mutation.SET_LOADING, { name: stateType.jobLoading, value: false })
  },

  async [type.startJob]({ commit, state }, { code, ...params }) {
    let jobRun
    try {
      jobRun = await apiService({
        action: api.start,
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        params,
        data: code,
        serviceName,
        uuid: state.job.short_uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on start job  in startJob action.\nError: ', e)
      return
    }
    logger.success(commit, 'Job was started')

    commit(type.mutation.SET_JOB_RUN, jobRun)
  },

  async [type.action.getJobRunStatus]({ commit, state }, jobRunShortUuid) {
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunStatusLoading, value: true })

    let status
    try {
      status = await apiService({
        action: api.jobrunStatus,
        serviceName,
        uuid: jobRunShortUuid || state.jobrun.short_uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on getjob run status in getJobRunStatus action.\nError: ', e)
      return
    }

    commit(type.mutation.SET_JOB_RUN, status)
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunStatusLoading, value: false })
  },

  async [type.action.stopJob]({ commit }, id) {
    let jobRun
    try {
      jobRun = await apiService({
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
    commit(type.mutation.SET_JOB_RUN, jobRun)
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

  async [type.updateJob]({ state: { job }, commit }, data) {
    let isUpdated = false

    let updatedJob
    try {
      updatedJob = await apiService({
        action: api.update,
        method: 'put',
        serviceName,
        uuid: job.short_uuid,
        data
      })
    } catch (e) {
      isUpdated = false
      logger.error(commit, 'Error on update job  in updateJob action.\nError: ', e)
      return isUpdated
    }
    logger.success(commit, 'Job was updated')
    commit(type.UPDATE_JOB, updatedJob)
    commit(`${GENERAL_STORE}/${gMutation.SET_BREADCRUMB_PARAMS}`, { jobId: updatedJob.name }, { root: true })

    isUpdated = true
    return isUpdated
  },

  async [type.action.resetStore]({ commit }) {
    commit(type.mutation.RESET_JOB_STORE)
  },

  async [type.action.resetJobRun]({ commit }) {
    commit(type.mutation.RESET_JOB_RUN)
  },

  async [type.action.changeJob]({ commit }, data) {
    commit(type.UPDATE_JOB, data)
  },

  async [type.action.deleteJob]({ commit }, { short_uuid: uuid, name }) {
    try {
      await apiService({
        uuid,
        action: api.delete,
        method: 'delete',
        serviceName
      })
      logger.success(commit, `You have successfully deleted the job ${name}`)

      return true
    } catch (error) {
      logger.error(commit, 'Error on delete job in deleteJob action.\nError: ', error)
    }
  }
}
