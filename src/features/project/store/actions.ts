import { map } from 'lodash'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import VueRouter from 'vue-router'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'
import { useGeneralStore } from '@/core/store/useGeneralStore'
const { isNavigationFailure, NavigationFailureType } = VueRouter

import { WORKSPACE_STORE, mutation as wMutation } from '@/features/workspace/store/types'
import { projectState, PROJECT_STORE, action, mutation, ProjectModel, ProjectVisibility } from './types'

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
      const logger = useLogger()

      logger.error('Error on load project in getProject action.\nError: ', error)

      project = new ProjectModel().state

      router.push({ name: 'project-does-not-exist' }).catch(failure => {
        if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
          logger.error('Error on redirect to workspace-project-does-not-exist.\nError: ', failure)
        }
      })

      return
    }

    commit(mutation.SET_PROJECT, project)

    const generalStore = useGeneralStore()
    generalStore.setBreadcrumbParams({ projectId: project.name, workspaceId: project.workspace.name })

    commit(mutation.SET_LOADING, { name: 'projectLoading', value: false })

    return project
  },

  async [action.getProjectMe]({ commit }, uuid) {
    let projectMe
    try {
      projectMe = await apiService({
        uuid,
        serviceName,
        action: api.projectMe
      })
    } catch (error) {
      const logger = useLogger()

      logger.error('Error on load projects in getProjects action.\nError: ', error)

      return
    }
    commit(`${WORKSPACE_STORE}/${wMutation.SET_CURRENT_PEOPLE}`, { permission: projectMe.permission }, { root: true })
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
      const logger = useLogger()

      logger.error('Error on load projects in getProjects action.\nError: ', error)

      return
    }

    commit(mutation.SET_PROJECTS, projects)
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
      const logger = useLogger()

      logger.error('Error on load packageData in getLastPackage action.\nError: ', e)

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
      workspace,
      visibility: ProjectVisibility.PRIVATE
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
    const logger = useLogger()

    let project
    try {
      project = await apiService({
        action: api.create,
        method: 'post',
        serviceName,
        data
      })
    } catch (error) {
      logger.error('Error on create project in createProject action.\nError:', error)

      return project
    }
    commit(mutation.UPDATE_PROJECTS, project)
    commit(
      'workspace/SET_WORKSPACE_PROJECTS',
      { results: [{ ...project, lastPackage: { short_uuid: '' } }] },
      { root: true }
    )

    logger.success(`The project ${project.name} is created`)

    return project
  },

  async [action.updateProject]({ commit, state }, data) {
    const logger = useLogger()

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
      logger.error('Error on update project in updateProject action.\nError: ', error as Error)

      return project
    }

    commit(mutation.SET_PROJECT, project)

    const generalStore = useGeneralStore()
    generalStore.setBreadcrumbParams({ projectId: project.name })

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
    const logger = useLogger()

    try {
      await apiService({
        action: api.delete,
        method: 'delete',
        serviceName,
        uuid: project.short_uuid
      })
    } catch (error) {
      logger.error('Error on delete project in deleteProject action.\nError: ', error)

      return
    }

    commit(`workspace/DELETE_WORKSPACE_PROJECT`, project, { root: true })

    logger.success(`You have successfully deleted the project ${project.name}`)
  }
}
