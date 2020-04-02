import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'

import { projectState, PROJECT_STORE, action, mutation } from './types'

const root = true
const serviceName = PROJECT_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<projectState, RootState> = {
  async [action.getProject]({ commit, dispatch }, id) {
    let project
    try {
      project = await dispatch(
        rootTypes.apiService,
        {
          action: api.get,
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load project  in getProject action.\nError: ', e)
      return
    }

    commit(mutation.SET_PROJECT, project)
  },

  async [action.getProjects]({ state, commit, dispatch }) {
    let projects
    try {
      projects = await dispatch(
        rootTypes.apiService,
        {
          action: api.list,
          serviceName,
          params: state.query
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load projects  in getProjects action.\nError: ', e)
      return
    }

    commit(mutation.SET_PROJECTS, projects)
  },

  async [action.getProjectJobs]({ commit, dispatch }, uuid) {
    let jobs
    try {
      jobs = await dispatch(
        rootTypes.apiService,
        {
          action: api.jobs,
          serviceName,
          uuid
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load project jobs in getProjectJobs action.\nError: ', e)
      return
    }

    commit(mutation.SET_PROJECT_JOBS, jobs)
  },

  async [action.resetProjectJobs]({ commit }) {
    commit(mutation.RESET_PORJECT_JOBS)
  }
}
