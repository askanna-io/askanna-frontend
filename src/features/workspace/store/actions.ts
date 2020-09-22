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
    commit(mutation.SET_LOADING, { name: stateType.workspacesLoading, value: false })
  },

  async [action.getInitialWorkpaceProjects]({ commit, dispatch }, data) {
    commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: true })

    await dispatch(action.getWorkpaceProjects, data)

    commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false })
  },

  async [action.getWorkpaceProjects]({ commit, dispatch, state }, { params }) {
    let projects
    try {
      projects = await apiService({
        action: api.projects,
        serviceName,
        uuid: state.workspace.short_uuid,
        params
      })
    } catch (error) {
      logger.error(commit, 'Error on load projects in getWorkpaceProjects action.\nError: ', error)

      return
    }
    commit(mutation.SET_WORKSPACE_PROJECTS, projects)
    commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false })
  },

  async [action.changeSettings]({ commit }, data) {
    commit(mutation.UPDATE_SETTINGS, data)
  },

  async [action.setQuery]({ commit }, data) {
    commit(mutation.SET_QUERY, data)
  },

  async [action.reset]({ commit }) {
    commit(mutation.RESET)
  },

  async [action.getInitialWorkpacePeople]({ commit, dispatch }, data) {
    commit(mutation.SET_LOADING, { name: stateType.workspacePeopleLoading, value: true })

    await dispatch(action.getWorkspacePeople, data)

    commit(mutation.SET_LOADING, { name: stateType.workspacePeopleLoading, value: false })
  },
  async [action.getWorkspacePeople]({ commit, state }, { workspaceId, params }) {
    commit(mutation.SET_LOADING, { name: stateType.workspacePeopleLoading, value: true })

    let people = []
    params = { ...params, ...state.workspacePeopleParams }
    try {
      people = await apiService({
        action: api.getWorkspacePeople,
        serviceName,
        uuid: workspaceId,
        params
      })
    } catch (error) {
      logger.error(commit, 'Error on load people in getWorkspacePeople action.\nError: ', error)

      return
    }
    const peopleMutation = params.offset === 0 ? mutation.SET_WORKSPACE_PEOPLE_INITIAL : mutation.SET_WORKSPACE_PEOPLE

    commit(peopleMutation, people)
    commit(mutation.SET_LOADING, { name: stateType.workspacePeopleLoading, value: false })
  },

  async [action.setWorkspaceParams]({ commit }, data) {
    commit(mutation.SET_WORKSPACE_PARAMS, data)
  }
}
