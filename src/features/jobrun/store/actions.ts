import * as type from './types'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import { debounce } from 'lodash'
import VueRouter from 'vue-router'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'
import { useGeneralStore } from '@/core/store/useGeneralStore'
const { isNavigationFailure, NavigationFailureType } = VueRouter
import { jobRunState, JOB_RUN_STORE, stateType } from './types'

const serviceName = JOB_RUN_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<jobRunState, RootState> = {
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
      const logger = useLogger()

      logger.error('Error on jobRun job in getJobRun action.\nError: ', e)

      router.push({ name: 'workspace-project-job-run-does-not-exist' }).catch(failure => {
        if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
          logger.error('Error on redirect to workspace-project-job-run-does-not-exist.\nError: ', failure)
        }
      })

      return
    }

    commit(type.SET_JOB_RUN, jobRun)
    commit(type.mutation.SET_LOADING, { name: stateType.jobRunLoading, value: false })

    const generalStore = useGeneralStore()
    generalStore.setBreadcrumbParams({ jobRunId: jobRun.name })
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
      const logger = useLogger()

      logger.error('Error on udapte jobRun job in udapteJobRun action.\nError: ', e)

      return
    }
    isUpdated = true

    commit(type.SET_JOB_RUN, jobRun)

    const generalStore = useGeneralStore()
    generalStore.setBreadcrumbParams({ jobRunId: jobRun.name })

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
      const logger = useLogger()

      logger.error('Error on jobrun log in getJobRunLog action.\nError: ', e)
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
      const logger = useLogger()

      logger.error('Error on jobrun log in getJobRunLog action.\nError: ', e)

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
      const logger = useLogger()

      logger.error('Error on artifactData in getJobRunArtifact action.\nError: ', e)
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
      const logger = useLogger()

      logger.error('Error on load packageTarget in getTargetPackage action.\nError: ', e)
      return ''
    }

    return packageTarget.target || ''
  },

  async [type.action.deleteRunInfo]({ commit }, { short_uuid: uuid, name }) {
    const logger = useLogger()

    try {
      await apiService({
        uuid,
        action: api.delete,
        method: 'delete',
        serviceName
      })
      logger.success(`You have successfully deleted the run ${name || uuid}`)

      return true
    } catch (error) {
      logger.error('Error on delete runInfo in deleteRunInfo action.\nError: ', error)
    }
  }
}
