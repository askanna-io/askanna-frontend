import { map } from 'lodash'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'

import { projectState, PROJECT_STORE, action, mutation, ProjectModel } from './types'
import { mutation as gMutation, GENERAL_STORE } from '@/core/store/general/types'

const serviceName = PROJECT_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<projectState, RootState> = {
  async [action.getProject]({ commit }, uuid) {
    commit(mutation.SET_LOADING, { name: 'projectLoading', value: true })

    let project
    try {
      project = await apiService({
        action: api.get,
        serviceName,
        uuid: uuid
      })
    } catch (error) {
      logger.error(commit, 'Error on load project  in getProject action.\nError: ', error)

      project = new ProjectModel().state
      router.push({ name: 'project-does-not-exist' })

      return
    }

    commit(mutation.SET_PROJECT, project)
    commit(`${GENERAL_STORE}/${gMutation.SET_BREADCRUMB_PARAMS}`, { projectId: project.name }, { root: true })
    commit(mutation.SET_LOADING, { name: 'projectLoading', value: false })
  },

  async [action.getProjects]({ state, commit }) {
    let projects
    try {
      projects = await apiService({
        action: api.list,
        serviceName,
        params: state.query
      })
    } catch (error) {
      logger.error(commit, 'Error on load projects in getProjects action.\nError: ', error)

      return
    }

    commit(mutation.SET_PROJECTS, projects)
  },

  async [action.getProjectJobs]({ commit }, uuid) {
    commit(mutation.SET_LOADING, { name: 'jobsLoading', value: true })

    let jobs
    try {
      jobs = await apiService({
        action: api.jobs,
        serviceName,
        uuid
      })
    } catch (error) {
      commit(mutation.SET_LOADING, { name: 'jobsLoading', value: false })

      logger.error(commit, 'Error on load project jobs in getProjectJobs action.\nError: ', error)

      return
    }

    await Promise.all(
      map(jobs, async (job: any) => {
        const runs = await apiService({
          action: api.getLastJobRun,
          serviceName,
          uuid: job.short_uuid,
          params: {
            limit: 1,
            offset: 0
          }
        })
        const run = runs && runs.results.length ? runs.results[0] : { status: 'NOT_RUNS', created: '' }
        job.runs = { count: runs.count, status: { status: run.status, created: run.created } }

        return job
      })
    )

    commit(mutation.SET_PROJECT_JOBS, jobs)
    commit(mutation.SET_LOADING, { name: 'jobsLoading', value: false })
  },

  async [action.resetProjectJobs]({ commit }) {
    commit(mutation.RESET_PORJECT_JOBS)
  },

  async [action.getLastPackage]({ commit }, uuid) {
    let packages
    let packageData = { short_uuid: '' }
    try {
      packages = await apiService({
        action: api.packages,
        serviceName,
        uuid,
        params: {
          limit: 1,
          offset: 0
        }
      })
      packageData = packages && packages.results && packages.results ? packages.results[0] : null
    } catch (e) {
      logger.error(commit, 'Error on load packageData in getLastPackage action.\nError: ', e)

      return
    }

    commit(mutation.SET_LAST_PACKAGE, packageData)
  },

  async [action.setMenu]({ commit }, data) {
    commit(mutation.SET_MENU, data)
  },

  async [action.createProjectShortWay]({ dispatch, state }, workspace) {
    const data = {
      name: state.project.name,
      workspace
    }
    dispatch(action.createProject, data)
  },

  async [action.createProjectFullWay]({ dispatch, state }, workspace) {
    const data = {
      ...state.project,
      workspace
    }
    const project = await dispatch(action.createProject, data)

    return project
  },

  async [action.createProject]({ commit }, data) {
    let project
    try {
      project = await apiService({
        action: api.create,
        method: 'post',
        serviceName,
        data
      })
    } catch (error) {
      logger.error(commit, 'Error on create project in createProject action.\nError:', error)

      return project
    }
    commit(mutation.RESET_PROJECT_DATA)
    commit(mutation.UPDATE_PROJECTS, project)
    commit(
      'workspace/SET_WORKSPACE_PROJECTS',
      { results: [{ ...project, lastPackage: { short_uuid: 'new-package' } }] },
      { root: true }
    )

    logger.success(commit, `The project ${project.name} is created`)

    return project
  },

  async [action.updateProject]({ commit, state }, data) {
    let project
    try {
      project = await apiService({
        action: api.update,
        method: 'put',
        serviceName,
        uuid: state.project.short_uuid,
        data
      })
    } catch (error) {
      logger.error(commit, 'Error on update project in updateProject action.\nError: ', error)

      return project
    }

    commit(mutation.SET_PROJECT, project)
    return project
  },

  [action.setProject]({ commit }, data) {
    commit(mutation.SET_PROJECT_DATA, data)
  },

  async [action.resetProjectData]({ commit }) {
    commit(mutation.RESET_PROJECT_DATA)
  },

  async [action.getProjectTemplates]({ commit }) {
    let projectTemplates
    try {
      projectTemplates = await apiService({
        action: api.templates,
        serviceName
      })
    } catch (error) {
      return
    }

    commit(mutation.SET_PROJECT_TEMPLATES, projectTemplates)
  },

  async [action.deleteProject]({ commit }, project) {
    try {
      await apiService({
        action: api.delete,
        method: 'delete',
        serviceName,
        uuid: project.short_uuid
      })
    } catch (error) {
      logger.error(commit, 'Error on delete project in deleteProject action.\nError: ', error)

      return
    }

    commit(`workspace/DELETE_WORKSPACE_PROJECT`, project, { root: true })

    logger.success(commit, `You have successfully deleted the project ${project.name}`)
  }
}
