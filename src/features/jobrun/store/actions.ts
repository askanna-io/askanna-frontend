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

    commit(type.SET_JOB_RUN, {
      ...jobRun,
      package: {
        short_uuid: '1KKO-yZH0-mM0Z-Sn87',
        size: 1294,
        title: 'Archive2.zip',
        uuid: '2ba15727-ed61-4dc1-a160-944b7b9b765f'
      }
    })
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
      logger.error(commit, 'Error on jobrun log  in getJobRunLog action.\nError: ', e)

      return
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

  async [type.action.getJobRunArtifact]({ commit }, uuid) {
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunArtifactLoading, value: true })

    let artifactData = {
      uuid: '2ba15727-ed61-4dc1-a160-944b7b9b765f',
      files: [
        {
          path: '__MACOSX',
          parent: '/',
          name: '__MACOSX',
          is_dir: true,
          size: 645,
          last_modified: '2020-09-04T12:28:05.760969',
          type: 'directory'
        },
        {
          path: 'README.md',
          parent: '/',
          name: 'README.md',
          is_dir: false,
          size: 42,
          last_modified: '2020-06-30T18:44:36',
          type: 'file'
        },
        {
          path: '__MACOSX/._README.md',
          parent: '__MACOSX',
          name: '._README.md',
          is_dir: false,
          size: 433,
          last_modified: '2020-06-30T18:44:36',
          type: 'file'
        },
        {
          path: 'askanna.yml',
          parent: '/',
          name: 'askanna.yml',
          is_dir: false,
          size: 66,
          last_modified: '2020-06-18T08:45:00',
          type: 'file'
        },
        {
          path: '__MACOSX/._askanna.yml',
          parent: '__MACOSX',
          name: '._askanna.yml',
          is_dir: false,
          size: 212,
          last_modified: '2020-06-18T08:45:00',
          type: 'file'
        }
      ],
      cdn_base_url: 'https://cdn-api.askanna.eu/files/blob/2ba15727-ed61-4dc1-a160-944b7b9b765f',
      created: '2020-07-28T20:32:16.386121Z',
      modified: '2020-07-28T20:32:16.386158Z',
      title: 'Archive2.zip',
      description: 'Archive2.zip',
      deleted: null,
      short_uuid: '1KKO-yZH0-mM0Z-Sn87',
      filename: 'Archive2.zip',
      storage_location: '1294_Archive2.zip',
      size: 1294,
      created_by: 5,
      project: 'f1e2144a-87f9-4936-8562-4304c51332ea'
    }
    /*  try {
      artifactData = await apiService({
        action: api.getJobRunArtifact,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on artifactData  in getJobRunArtifact action.\nError: ', e)

      return
    } */

    commit(type.SET_JOB_RUN_ARTIFACT, { artifactData })
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunArtifactLoading, value: false })
  }
}
