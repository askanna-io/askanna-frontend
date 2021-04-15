import * as type from './types'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import * as rootTypes from '@/core/store/actionTypes'
import { apiStringify } from '@/core/services/api-settings'
import { jobRunState, JobRun, JOB_RUN_STORE, stateType } from './types'

const root = true
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

    let jobRun = {}
    try {
      jobRun = await apiService({
        action: api.getJobRun,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on jobRun job  in getJobRun action.\nError: ', e)

      router.push({ name: 'workspace-project-job-run-does-not-exist' })

      return
    }

    commit(type.SET_JOB_RUN, jobRun)
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunLoading, value: false })
  },

  async [type.action.getJobRunPayload]({ commit }, uuid) {
    commit(type.mutation.SET_LOADING, { name: stateType.payLoadLoading, value: true })

    let jobRunPayload
    try {
      jobRunPayload = await apiService({
        action: api.getJobRunPayload,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on jobRunPayload job  in getJobRunPayload action.\nError: ', e)
      commit(type.mutation.SET_LOADING, { name: stateType.payLoadLoading, value: false })

      return
    }
    commit(type.SET_JOB_RUN_PAYLOAD, jobRunPayload)
    commit(type.mutation.SET_LOADING, { name: stateType.payLoadLoading, value: false })
  },

  async [type.action.getJobRunResult]({ commit }, uuid) {
    commit(type.mutation.SET_LOADING, { name: stateType.resultLoading, value: true })

    let jobRunResult = ''
    try {
      jobRunResult = await apiService({
        uuid,
        serviceName,
        responseType: 'text',
        action: api.getJobRunResult,
        transformResponse: [data => data]
      })
    } catch (e) {
      logger.error(commit, 'Error on jobRunResult job  in getJobRunResult action.\nError: ', e)
    }
    commit(type.SET_JOB_RUN_RESULT, jobRunResult)
    commit(type.mutation.SET_LOADING, { name: stateType.resultLoading, value: false })
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

    if (!uuid.jobRunShortId || !uuid.artifactShortId) {
      setTimeout(() => commit(type.mutation.SET_LOADING, { name: stateType.jobRunArtifactLoading, value: false }), 1000)
      return
    }

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

  async [type.action.getFileSource]({ dispatch, state, commit }, path) {
    if (!path) return commit(type.mutation.SET_FILE, '')
    if (!state.artifactData) return commit(type.mutation.SET_FILE, '')

    commit(type.mutation.RESET_FILE_FILESOURCE)

    const url = `${state.artifactData.cdn_base_url}/${path}`

    let fileSource
    try {
      fileSource = await dispatch(
        rootTypes.apiDownloadSerice,
        {
          url
        },
        { root }
      )
    } catch (e) {
      logger.error(commit, 'Error on load fileSource in getFileSource action.\nError: ', e)
      return
    }

    const file = await fileSource.text()

    commit(type.mutation.SET_FILE, { file, fileSource })
  },

  async [type.action.resetFile]({ commit }) {
    commit(type.mutation.RESET_FILE_FILESOURCE)
  },

  async [type.action.downloadPackage]({ dispatch, commit }, uuid) {
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
  }
}
