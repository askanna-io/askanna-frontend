import { delay, map } from 'lodash'
import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'
import { workspaceState, WORKSPACE_STORE, stateType, action, mutation } from './types'

const serviceName = WORKSPACE_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<workspaceState, RootState> = {
  async [action.getWorkspace]({ commit }, uuid) {
    let workspace
    try {
      workspace = await apiService({
        action: api.get,
        serviceName,
        uuid
      })
    } catch (error) {
      logger.error(commit, 'Error on load workspaces  in getWorkspaces action.\nError: ', error)

      return
    }

    commit(mutation.SET_WORKSPACE, workspace)
  },

  async [action.getWorkspaces]({ state, commit }) {
    commit(mutation.SET_LOADING, { name: stateType.workspacesLoading, value: true })
    let workspaces
    try {
      workspaces = await apiService({
        action: api.list,
        serviceName,
        params: state.workspaceQuery
      })
    } catch (error) {
      logger.error(commit, 'Error on load workspaces in getWorkspaces action.\nError: ', error)
      commit(mutation.SET_LOADING, { name: stateType.workspacesLoading, value: false })

      return
    }

    commit(mutation.SET_WORKSPACES, workspaces)
    delay(() => commit(mutation.SET_LOADING, { name: stateType.workspacesLoading, value: false }), 350, 'later')
  },

  async [action.getWorkpaceProjects]({ commit, state, dispatch }, uuid) {
    commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: true })

    let projects
    try {
      projects = await apiService({
        action: api.projects,
        serviceName,
        uuid,
        params: state.workspaceProjectsQuery
      })
    } catch (error) {
      logger.error(commit, 'Error on load projects in getWorkpaceProjects action.\nError: ', error)

      commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false })

      return
    }
    const results = await Promise.all(
      map(projects.results, async (project: any) => {
        console.log(project)
        const packages = await apiService({
          action: api.getProjectPackages,
          serviceName,
          uuid: project.short_uuid
        })

        project.packages = packages
        project.lastPackage = packages.length ? packages[0] : { short_uuid: '' }
        console.log('1')

        return project
      })
    )

    commit(mutation.SET_WORKSPACE_PROJECTS, { results, count: results.length })
    delay(() => commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false }), 350, 'later')
  },

  async [action.changeSettings]({ commit }, data) {
    commit(mutation.UPDATE_SETTINGS, data)
  }
}
