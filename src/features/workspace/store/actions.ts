import { get, map } from 'lodash'
import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'
import { mutation as gMutation, GENERAL_STORE } from '@/core/store/general/types'
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
    commit(`${GENERAL_STORE}/${gMutation.SET_BREADCRUMB_PARAMS}`, { workspaceId: workspace.title }, { root: true })
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
    try {
      people = await apiService({
        action: api.getWorkspacePeople,
        serviceName,
        uuid: workspaceId
      })
    } catch (error) {
      logger.error(commit, 'Error on load people in getWorkspacePeople action.\nError: ', error)

      return
    }

    commit(mutation.SET_WORKSPACE_PEOPLE_INITIAL, people)
    commit(mutation.SET_LOADING, { name: stateType.workspacePeopleLoading, value: false })
  },

  async [action.deleteWorkspacePeople]({ commit, state }, item) {
    commit(mutation.DELETE_WORKSPACE_PEOPLE, item)

    logger.success(
      commit,
      `You have successfully deleted ${item.name} from the workspace
    ${state.workspace.title}`
    )
  },

  async [action.setWorkspaceParams]({ commit }, data) {
    commit(mutation.SET_WORKSPACE_PARAMS, data)
  },

  async [action.sendInvitations]({ state, commit, dispatch }, data) {
    const result = await Promise.all(
      map(data, async email => {
        const people = await dispatch(action.sendInviteEmail, {
          email,
          name: email,
          front_end_url: window.location.origin,
          object_uuid: state.workspace.uuid
        })
        if (people.short_uuid && people) {
          return people
        }

        return { email: '', name: '' }
      })
    )
    const people = result.filter(item => item.email !== '')

    if (people.length) {
      commit(mutation.UPDATE_WORKSPACE_PEOPLE, people)
      logger.success(
        commit,
        `You have successfully invited ${people.map(item => item.email).join(', ')} to join the workspace
      ${state.workspace.title}`
      )
    }
  },

  async [action.resendInvitation]({ state, commit }, uuid) {
    let response

    const data = {
      status: 'invited'
    }
    try {
      response = await apiService({
        action: api.acceptInvitetion,
        method: 'PATCH',
        uuid,
        serviceName,
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on resent invatation in resendInvitation action.\nError: ', e)

      return e
    }

    if (response) {
      logger.success(
        commit,
        `You have successfully re-invited ${response.email} to join the workspace
      ${state.workspace.title}`
      )
    }
  },

  async [action.sendInviteEmail]({ state, commit }, data) {
    let response
    try {
      response = await apiService({
        action: api.invitePeople,
        method: 'post',
        uuid: state.workspace.short_uuid,
        serviceName,
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on upload package in registerPackage action.\nError: ', e)

      return e
    }

    return response
  },

  async [action.acceptInvitetion]({ commit }, { token, peopleId, workspaceId }) {
    let response

    const data = {
      status: 'accepted',
      token
    }
    try {
      response = await apiService({
        action: api.acceptInvitetion,
        method: 'PATCH',
        uuid: { workspaceId, peopleId },
        serviceName,
        data
      })
    } catch (e) {
      return e
    }

    return response
  },

  async [action.getInvitetionInfo]({ commit }, { token, peopleId, workspaceId }) {
    let response

    try {
      response = await apiService({
        action: api.acceptInvitetion,
        uuid: { workspaceId, peopleId },
        serviceName,
        params: { token }
      })
    } catch (e) {
      const message = get(e, 'response.data.token') || 'Your token is not valid.\nError: '
      logger.error(commit, message, e)

      commit(mutation.RESET_INVITATION)
      return
    }
    commit(mutation.SET_INVITATION, response)
  }
}
