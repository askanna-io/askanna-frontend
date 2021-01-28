import { get, map } from 'lodash'
import { ActionTree } from 'vuex'
import router from '@/core/router'
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
      logger.error(commit, 'Error on load workspace in getWorkspace action.\nError: ', error)

      router.push({ name: 'workspace-does-not-exist' })

      return
    }

    commit(mutation.SET_WORKSPACE, workspace)
    commit(`${GENERAL_STORE}/${gMutation.SET_BREADCRUMB_PARAMS}`, { workspaceId: workspace.title }, { root: true })
  },

  async [action.getWorkspaces]({ state, commit }) {
    commit(mutation.SET_LOADING, { workspaces: true })
    let workspaces
    try {
      workspaces = await apiService({
        action: api.list,
        serviceName,
        params: state.workspaceQuery
      })
    } catch (error) {
      logger.error(commit, 'Error on load workspaces in getWorkspaces action.\nError: ', error)
      commit(mutation.SET_LOADING, { workspaces: false })

      return
    }

    commit(mutation.SET_WORKSPACES, workspaces)
    commit(mutation.SET_LOADING, { workspaces: false })

    return workspaces
  },

  async [action.getInitialWorkpaceProjects]({ commit, dispatch }, data) {
    commit(mutation.SET_LOADING, { projects: true })

    await dispatch(action.getWorkpaceProjects, { ...data, initial: true })

    commit(mutation.SET_LOADING, { projects: false })
  },

  async [action.getWorkpaceProjects]({ state, commit }, { params, initial }) {
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

    if (initial) {
      commit(mutation.SET_INITIAL_WORKSPACE_PROJECTS, projects)
    } else {
      commit(mutation.SET_WORKSPACE_PROJECTS, projects)
    }

    commit(mutation.SET_LOADING, { projects: false })
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

  async [action.getInitialWorkpacePeople]({ dispatch }, data) {
    await dispatch(action.getWorkspacePeople, data)
    await dispatch(action.getCurrentPeople)
  },

  async [action.getWorkspacePeople]({ commit }, { workspaceId }) {
    commit(mutation.SET_LOADING, { people: true })

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
    commit(mutation.SET_LOADING, { people: false })
  },

  async [action.setWorkspaceParams]({ commit }, data) {
    commit(mutation.SET_WORKSPACE_PARAMS, data)
  },

  async [action.sendInvitations]({ state, commit, dispatch }, data) {
    const result = await Promise.all(
      map(data, async email => {
        const people = await dispatch(action.sendInviteEmail, {
          email,
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

  async [action.deleteInvitation]({ commit }, people) {
    let response

    try {
      response = await apiService({
        action: api.acceptInvitetion,
        method: 'DELETE',
        uuid: {
          peopleId: people.short_uuid,
          workspaceId: people.workspace.short_uuid
        },
        serviceName
      })
    } catch (e) {
      logger.error(commit, 'Error on delete invatation in deleteInvitation action.\nError: ', e)

      return e
    }
    commit(mutation.DELETE_WORKSPACE_PEOPLE, people)
    logger.success(
      commit,
      `You have successfully deleted the invitation for ${people.name} on the workspace
      ${people.workspace.name}`
    )
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

  async [action.changeRole]({ commit }, { role, peopleId, workspaceId }) {
    let people

    const data = {
      role
    }
    try {
      people = await apiService({
        action: api.acceptInvitetion,
        method: 'PATCH',
        uuid: { workspaceId, peopleId },
        serviceName,
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on change people Role in changeRole action.\nError: ', e)

      return e
    }
    logger.success(
      commit,
      `You have successfully changed the role of ${people.name} for the workspace ${people.workspace.name}.`
    )

    commit(mutation.CHANGE_WORKSPACE_PEOPLE, people)

    return people
  },

  async [action.updateWorkspaceProfile]({ state, commit }, data) {
    let people

    try {
      people = await apiService({
        action: api.acceptInvitetion,
        method: 'PATCH',
        uuid: { workspaceId: state.workspace.short_uuid, peopleId: state.currentPeople.short_uuid },
        serviceName,
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on change people in updateWorkspaceProfile action.\nError: ', e)

      return e
    }

    commit(mutation.SET_CURRENT_PEOPLE, people)
    commit(mutation.CHANGE_WORKSPACE_PEOPLE, people)

    return people
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
  },

  async [action.deleteWorkspacePeople]({ commit }, people) {
    try {
      await apiService({
        action: api.acceptInvitetion,
        method: 'DELETE',
        uuid: { workspaceId: people.workspace.short_uuid, peopleId: people.short_uuid },
        serviceName
      })
    } catch (e) {
      logger.error(commit, 'Error on delete people in deleteWorkspacePeople action.\nError: ', e)

      return e
    }

    commit(mutation.DELETE_WORKSPACE_PEOPLE, people)

    logger.success(
      commit,
      `You have successfully deleted ${people.name} from the workspace
    ${people.workspace.name}`
    )
  },

  async [action.getCurrentPeople]({ state, commit }) {
    const people = state.workspacePeople.find(item => item.user.short_uuid === state.currentPeople.user.short_uuid)

    commit(mutation.SET_CURRENT_PEOPLE, people)

    if (people && process.env.VUE_APP_INTERCOM === 'on') {
      window.Intercom('boot', {
        app_id: 'c6wuieqm',
        name: people.name,
        email: people.email,
        user_id: people.user.short_uuid,
        created_at: state.currentPeople.created_at
      })
    }
  },

  async [action.setLoading]({ commit }, data) {
    commit(mutation.SET_LOADING, data)
  },

  async [action.setPeopleAvatar]({ state, commit }, data) {
    let result

    try {
      result = await apiService({
        action: api.setPeopleAvatar,
        method: 'PATCH',
        uuid: { workspaceId: state.workspace.short_uuid, peopleId: state.currentPeople.short_uuid },
        serviceName,
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on update people avatar in setPeopleAvatar action.\nError: ', e)

      return e
    }

    return result
  }
}
