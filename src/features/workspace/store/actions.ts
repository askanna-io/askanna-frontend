import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'
import { delay } from 'lodash'

import { workspaceState, WORKSPACE_STORE, stateType, action, mutation } from './types'

const root = true
const serviceName = WORKSPACE_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<workspaceState, RootState> = {
  async [action.getWorkspace]({ commit, dispatch }, uuid) {
    let workspace
    try {
      workspace = await dispatch(
        rootTypes.apiService,
        {
          action: api.get,
          serviceName,
          uuid
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load workspaces  in getWorkspaces action.\nError: ', e)
      return
    }

    commit(mutation.SET_WORKSPACE, workspace)
    dispatch(action.getWorkpaceProjects, workspace.short_uuid)
  },

  async [action.getWorkspaces]({ state, commit, dispatch }) {
    commit(mutation.SET_LOADING, { name: stateType.workspacesLoading, value: true })
    let workspaces
    try {
      workspaces = await dispatch(
        rootTypes.apiService,
        {
          action: api.list,
          serviceName,
          params: state.workspaceQuery
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load workspaces  in getWorkspaces action.\nError: ', e)
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
      projects = await dispatch(
        rootTypes.apiService,
        {
          action: api.projects,
          serviceName,
          uuid,
          params: state.workspaceProjectsQuery
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load projects in getWorkpaceProjects action.\nError: ', e)
      commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false })

      return
    }

    commit(mutation.SET_WORKSPACE_PROJECTS, projects)
    delay(() => commit(mutation.SET_LOADING, { name: stateType.workspaceProjectsLoading, value: false }), 350, 'later')
  }
}
