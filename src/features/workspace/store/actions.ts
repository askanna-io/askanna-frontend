import { get, map } from 'lodash'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import VueRouter from 'vue-router'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'
const { isNavigationFailure, NavigationFailureType } = VueRouter
import { workspaceState, WORKSPACE_STORE, action, mutation } from './types'
import { mutation as gMutation, GENERAL_STORE } from '@/core/store/general/types'

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
      const logger = useLogger()

      logger.error('Error on load workspace in getWorkspace action.\nError: ', error)

      return router.push({ name: 'workspace-does-not-exist' }).catch(failure => {
        if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
          logger.error('Error on to redirect to workspace-does-not-exist.\nError: ', failure)
        }
      })
    }

    commit(mutation.SET_WORKSPACE, workspace)
    commit(`${GENERAL_STORE}/${gMutation.SET_BREADCRUMB_PARAMS}`, { workspaceId: workspace.name }, { root: true })
  },

  async [action.updateWorkspace]({ state, commit }, data) {
    const logger = useLogger()

    let workspace
    try {
      workspace = await apiService({
        data,
        serviceName,
        method: 'put',
        action: api.get,
        uuid: state.workspace.short_uuid
      })
    } catch (error) {
      logger.error('Error on update workspace in getWorkspace action.\nError: ', error)

      return workspace
    }

    commit(mutation.SET_WORKSPACE, workspace)
    commit(`${GENERAL_STORE}/${gMutation.SET_BREADCRUMB_PARAMS}`, { workspaceId: workspace.name }, { root: true })

    return workspace
  },

  async [action.getWorkspaces]({ state, commit }, { membership } = { membership: true }) {
    const logger = useLogger()

    commit(mutation.SET_LOADING, { workspaces: true })
    let workspaces
    try {
      workspaces = await apiService({
        serviceName,
        action: api.list,
        params: { ...state.workspaceQuery, membership }
      })
    } catch (error) {
      logger.error('Error on load workspaces in getWorkspaces action.\nError: ', error)
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

  async [action.getWorkpaceProjects]({ state, commit }, { workspaceId, params, initial }) {
    const logger = useLogger()

    let projects
    try {
      projects = await apiService({
        params,
        serviceName,
        action: api.projects,
        uuid: state.workspace.short_uuid || workspaceId
      })
    } catch (error) {
      logger.error('Error on load projects in getWorkpaceProjects action.\nError: ', error)

      return
    }

    if (initial) {
      commit(mutation.SET_INITIAL_WORKSPACE_PROJECTS, projects)
    } else {
      commit(mutation.SET_WORKSPACE_PROJECTS, projects)
    }

    // @TODO:1 refactore loading after create project
    setTimeout(() => commit(mutation.SET_LOADING, { projects: false }), 1000)
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
      const logger = useLogger()

      logger.error('Error on load people in getWorkspacePeople action.\nError: ', error)

      return
    }

    commit(mutation.SET_WORKSPACE_PEOPLE_INITIAL, people)
    commit(mutation.SET_LOADING, { people: false })
  },

  async [action.setWorkspaceParams]({ commit }, data) {
    commit(mutation.SET_WORKSPACE_PARAMS, data)
  },

  async [action.sendInvitations]({ state, commit, dispatch }, { emails, role }) {
    const logger = useLogger()

    const result = await Promise.all(
      map(emails, async email => {
        const people = await dispatch(action.sendInviteEmail, {
          role,
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
        `You have successfully invited ${people.map(item => item.email).join(', ')} to join the workspace
      ${state.workspace.name}`
      )
    }
  },

  async [action.resendInvitation]({ state, commit }, uuid) {
    const logger = useLogger()

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
      logger.error('Error on resent invatation in resendInvitation action.\nError: ', e)

      return e
    }

    if (response) {
      logger.success(
        `You have successfully re-invited ${response.email} to join the workspace
      ${state.workspace.name}`
      )
    }
  },

  async [action.deleteInvitation]({ commit }, people) {
    const logger = useLogger()

    try {
      await apiService({
        action: api.acceptInvitetion,
        method: 'DELETE',
        uuid: {
          peopleId: people.short_uuid,
          workspaceId: people.workspace.short_uuid
        },
        serviceName
      })
    } catch (e) {
      logger.error('Error on delete invatation in deleteInvitation action.\nError: ', e)

      return e
    }
    commit(mutation.DELETE_WORKSPACE_PEOPLE, people)
    logger.success(
      `You have successfully deleted the invitation for ${people.name} on the workspace
      ${people.workspace.name}`
    )
  },

  async [action.sendInviteEmail]({ state, commit }, data) {
    const logger = useLogger()

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
      logger.error('Error on upload package in registerPackage action.\nError: ', e)

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
    const logger = useLogger()

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
      logger.error('Error on change people Role in changeRole action.\nError: ', e)

      return e
    }
    logger.success(
      `You have successfully changed the role of ${people.name} for the workspace ${people.workspace.name}.`
    )

    commit(mutation.CHANGE_WORKSPACE_PEOPLE, people)

    return people
  },

  async [action.updateWorkspaceProfile]({ state, commit }, data) {
    let people

    try {
      people = await apiService({
        data,
        serviceName,
        method: 'PATCH',
        action: api.profile,
        uuid: state.workspace.short_uuid
      })
    } catch (e) {
      const logger = useLogger()

      logger.error('Error on change people in updateWorkspaceProfile action.\nError: ', e)

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
      const logger = useLogger()

      const message = get(e, 'response.data.token') || 'Your token is not valid.\nError: '
      logger.error(message, e)

      commit(mutation.RESET_INVITATION)
      return
    }
    commit(mutation.SET_INVITATION, response)
  },

  async [action.deleteWorkspacePeople]({ commit }, people) {
    const logger = useLogger()

    try {
      await apiService({
        action: api.acceptInvitetion,
        method: 'DELETE',
        uuid: { workspaceId: people.workspace.short_uuid, peopleId: people.short_uuid },
        serviceName
      })
    } catch (e) {
      logger.error('Error on delete people in deleteWorkspacePeople action.\nError: ', e)

      return e
    }

    commit(mutation.DELETE_WORKSPACE_PEOPLE, people)

    logger.success(
      `You have successfully deleted ${people.name} from the workspace
    ${people.workspace.name}`
    )
  },

  async [action.getCurrentPeople]({ state, rootState, commit }, { workspaceId }) {
    let people

    try {
      people = await apiService({
        serviceName,
        action: api.profile,
        uuid: workspaceId || state.workspace.short_uuid
      })
    } catch (e) {
      const logger = useLogger()

      logger.error('Error on get people in getCurrentPeople action.\nError: ', e)

      return e
    }

    commit(mutation.SET_CURRENT_PEOPLE, people)
    const name = people.name || people.membership.name || rootState.user.globalProfile.name

    if (people && process.env.VUE_APP_INTERCOM === 'on') {
      window.Intercom('boot', {
        app_id: 'c6wuieqm',
        name: name,
        email: people.email,
        user_id: people.membership?.user?.short_uuid,
        created_at: rootState.user?.userProfile?.date_joined
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
        action: api.profileAvatar,
        method: 'PATCH',
        uuid: state.workspace.short_uuid,
        serviceName,
        data
      })
    } catch (e) {
      const logger = useLogger()

      logger.error('Error on update people avatar in setPeopleAvatar action.\nError: ', e)

      return e
    }

    return result
  },

  async [action.deleteWorkspace]({ commit }, workspace) {
    const logger = useLogger()

    try {
      await apiService({
        action: api.delete,
        method: 'delete',
        serviceName,
        uuid: workspace.short_uuid
      })

      logger.success(`You have successfully deleted the workspace ${workspace.name}`)

      return true
    } catch (error) {
      logger.error('Error on delete workspace in deleteWorkspace action.\nError: ', error)

      return
    }
  }
}
