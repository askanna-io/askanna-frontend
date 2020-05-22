import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import { apiStringify } from '@/core/services/api-settings'
import * as rootTypes from '@/core/store/actionTypes'
import apiService from '@/core/services/apiService'

import { projectState, PROJECT_STORE, action, mutation } from './types'

const serviceName = PROJECT_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<projectState, RootState> = {
  async [action.getProject]({ commit, dispatch }, uuid) {
    let project
    try {
      project = await apiService({
        action: api.get,
        serviceName,
        uuid: uuid
      })
    } catch (error) {
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on load project  in getProject action.\nError:',
        error
      })
      return
    }

    commit(mutation.SET_PROJECT, project)
  },

  async [action.getProjects]({ state, commit, dispatch }) {
    let projects
    try {
      projects = await apiService({
        action: api.list,
        serviceName,
        params: state.query
      })
    } catch (error) {
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on load projects in getProjects action.\nError:',
        error
      })
      return
    }

    commit(mutation.SET_PROJECTS, projects)
  },

  async [action.getProjectJobs]({ commit, dispatch }, uuid) {
    let jobs
    try {
      jobs = await apiService({
        action: api.jobs,
        serviceName,
        uuid
      })
    } catch (error) {
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on load project jobs in getProjectJobs action.\nError: ',
        error
      })
      return
    }

    commit(mutation.SET_PROJECT_JOBS, jobs)
  },

  async [action.resetProjectJobs]({ commit }) {
    commit(mutation.RESET_PORJECT_JOBS)
  }
}
