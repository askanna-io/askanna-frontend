import { delay } from 'lodash'
import { ActionTree } from 'vuex'
import apiService from '@/core/services/apiService'
import * as rootTypes from '@/core/store/actionTypes'
import { apiStringify } from '@/core/services/api-settings'

import { workspaceState, WORKSPACE_STORE, stateType, action, mutation } from './types'

const root = true
const serviceName = WORKSPACE_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<workspaceState, RootState> = {
  async [action.getWorkspace]({ commit, dispatch }, uuid) {
    let workspace
    try {
      workspace = await apiService({
        action: api.get,
        serviceName,
        uuid
      })
    } catch (error) {
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on load workspaces  in getWorkspaces action.\nError: ',
        error
      })
      return
    }

    commit(mutation.SET_WORKSPACE, workspace)
  },

  async [action.getWorkspaces]({ state, commit, dispatch }) {
    commit(mutation.SET_LOADING, { name: stateType.workspacesLoading, value: true })
    let workspaces
    try {
      workspaces = await apiService({
        action: api.list,
        serviceName,
        params: state.workspaceQuery
      })
    } catch (error) {
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on load workspaces in getWorkspaces action.\nError: ',
        error
      })

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
      dispatch(rootTypes.loggerError, {
        errorHint: 'Error on load projects in getWorkpaceProjects action.\nError: ',
        error
      })
      commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false })

      return
    }

    commit(mutation.SET_WORKSPACE_PROJECTS, projects)
    delay(() => commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false }), 350, 'later')
  },

  async [action.changeSettings]({ commit }, data) {
    commit(mutation.UPDATE_SETTINGS, data)
  }
}
