import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import * as rootTypes from '@/core/store/actionTypes'
import { apiStringify } from '@/core/services/api-settings'
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
  },

  async [action.createProject]({ commit, dispatch, state }, workspace) {
    let project = {
      name: 'test2'
    }
    try {
      project = await apiService({
        action: api.create,
        method: 'post',
        serviceName,
        data: {
          name: state.createProject.name,
          workspace
        }
      })
    } catch (error) {
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on create project in createProject action.\nError:',
        error
      })
      return
    }
    commit(mutation.RESET_PROJECT_DATA)
    commit(mutation.UPDATE_PROJECTS, project)
    commit('workspace/UPDATE_PROJECTS', { ...project, short_uuid: '', lastPackage: { short_uuid: '' } }, { root: true })
    logger.success(commit, `The project ${project.name} is created`)
    return project
  },

  async [action.updateProject]({ commit, dispatch, state }, uuid) {
    let project
    try {
      project = await apiService({
        action: api.update,
        method: 'put',
        serviceName,
        uuid: '7MQT-6309-9g3t-R5QR',
        data: state.createProject
      })
    } catch (error) {
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on create project in createProject action.\nError:',
        error
      })
      return
    }

    commit(mutation.UPDATE_PROJECTS, project)
  },

  [action.setProject]({ commit }, data) {
    commit(mutation.SET_PROJECT_DATA, data)
  }
}
