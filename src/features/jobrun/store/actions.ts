import * as type from './types'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import { debounce } from 'lodash'
import VueRouter from 'vue-router'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'
const { isNavigationFailure, NavigationFailureType } = VueRouter
import { jobRunState, JobRun, JOB_RUN_STORE, stateType } from './types'
import { mutation as gMutation, GENERAL_STORE } from '@/core/store/general/types'

const serviceName = JOB_RUN_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<jobRunState, RootState> = {
  async [type.action.getRunsJob]({ commit }, { uuid, params }) {
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunsLoading, value: true })

    let runs: JobRun[]
    try {
      runs = await apiService({
        uuid,
        params,
        serviceName,
        action: api.runs
      })
    } catch (e) {
      logger.error(commit, 'Error on runs job  in getRunsJob action.\nError: ', e)
      commit(type.mutation.SET_LOADING, { name: stateType.jobRunsLoading, value: false })

      return
    }

    commit(type.SET_JOB_RUNS, runs)
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunsLoading, value: false })
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

    let jobRun = { name: '' }
    try {
      jobRun = await apiService({
        action: api.getJobRun,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on jobRun job  in getJobRun action.\nError: ', e)

      router.push({ name: 'workspace-project-job-run-does-not-exist' }).catch(failure => {
        if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
          logger.error(commit, 'Error on redirect to workspace-project-job-run-does-not-exist.\nError: ', failure)
        }
      })

      return
    }

    commit(type.SET_JOB_RUN, jobRun)
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunLoading, value: false })
    commit(`${GENERAL_STORE}/${gMutation.SET_BREADCRUMB_PARAMS}`, { jobRunId: jobRun.name }, { root: true })
  },

  async [type.action.udapteJobRun]({ commit }, { uuid, data }) {
    let isUpdated = false
    let jobRun = { name: '' }
    try {
      jobRun = await apiService({
        uuid,
        data,
        serviceName,
        method: 'PATCH',
        action: api.getJobRun
      })
    } catch (e) {
      logger.error(commit, 'Error on udapte jobRun job  in udapteJobRun action.\nError: ', e)

      return
    }
    isUpdated = true

    commit(type.SET_JOB_RUN, jobRun)
    commit(`${GENERAL_STORE}/${gMutation.SET_BREADCRUMB_PARAMS}`, { jobRunId: jobRun.name }, { root: true })

    return isUpdated
  },

  async [type.action.setLoading]({ commit }, data) {
    commit(type.mutation.SET_LOADING, data)
  },

  async [type.action.getInitJobRunLog]({ commit, dispatch }, data) {
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunlogLoading, value: true })

    await dispatch(type.action.getJobRunLog, data)

    commit(type.mutation.SET_LOADING, { name: stateType.jobRunlogLoading, value: false })
  },

  async [type.action.getJobRunLog]({ commit }, { uuid, params }) {
    const turnOnScrollLoading = function () {
      commit(type.mutation.SET_LOADING, { name: stateType.jobRunlogScrollLoading, value: true })
    }
    const throttled = debounce(turnOnScrollLoading, 1000, { trailing: false, leading: true })
    throttled()

    let jobRunLog = {
      next: 0,
      count: 0,
      results: []
    }
    try {
      jobRunLog = await apiService({
        action: api.getJobRunLog,
        serviceName,
        uuid,
        params
      })
    } catch (e) {
      logger.error(commit, 'Error on jobrun log in getJobRunLog action.\nError: ', e)
    }
    commit(type.SET_JOB_RUN_LOG, jobRunLog)

    const turnOffScrollLoading = function () {
      commit(type.mutation.SET_LOADING, { name: stateType.jobRunlogScrollLoading, value: false })
    }
    const throttledOff = debounce(turnOffScrollLoading, 2000, { trailing: false, leading: true })

    throttledOff()
  },

  async [type.action.getFullVersionJobRunLog]({ commit }, uuid) {
    let jobRunLog = {
      next: 0,
      count: 0,
      results: []
    }
    try {
      jobRunLog = await apiService({
        action: api.getJobRunLog,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on jobrun log  in getJobRunLog action.\nError: ', e)

      return
    }
    commit(type.SET_JOB_RUN_LOG_FULL_VERSION, jobRunLog)
  },

  async [type.action.resetJobRunLog]({ commit }) {
    commit(type.mutation.RESET_JOB_RUN_LOG)
  },

  async [type.action.getInitialJobRunArtifact]({ dispatch }, data) {
    await dispatch(type.action.getJobRunArtifact, data)
  },

  async [type.action.getJobRunArtifact]({ commit }, { uuid, params }) {
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunArtifactLoading, value: true })
    let artifactData = {}
    try {
      artifactData = await apiService({
        action: api.getJobRunArtifact,
        serviceName,
        uuid,
        params
      })
    } catch (e) {
      logger.error(commit, 'Error on artifactData  in getJobRunArtifact action.\nError: ', e)
      commit(type.mutation.SET_LOADING, { name: stateType.jobRunArtifactLoading, value: false })

      return
    }

    commit(type.SET_JOB_RUN_ARTIFACT, { artifactData })
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunArtifactLoading, value: false })
  },

  async [type.action.downloadPackage]({ dispatch }, uuid) {
    const url = await dispatch(type.action.getTargetPackage, uuid)

    return url
  },

  async [type.action.getTargetPackage]({ commit }, uuid) {
    let packageTarget
    try {
      packageTarget = await apiService({
        action: api.getDownloadLink,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on load packageTarget in getTargetPackage action.\nError: ', e)
      return ''
    }

    return packageTarget.target || ''
  },

  async [type.action.deleteRunInfo]({ commit }, { short_uuid: uuid, name }) {
    try {
      await apiService({
        uuid,
        action: api.delete,
        method: 'delete',
        serviceName
      })
      logger.success(commit, `You have successfully deleted the run ${name || uuid}`)

      return true
    } catch (error) {
      logger.error(commit, 'Error on delete runInfo in deleteRunInfo action.\nError: ', error)
    }
  }
}
