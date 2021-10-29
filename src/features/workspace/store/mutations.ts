import { set, get } from 'lodash'
import { mutation } from './types'
import { MutationTree } from 'vuex'
import { workspaceState, InvitationModel } from './types'

export const mutations: MutationTree<workspaceState> = {
  [mutation.SET_WORKSPACE](state, data) {
    state.workspace = data
  },
  [mutation.SET_WORKSPACES](state, data) {
    state.workspaces = data
  },
  [mutation.SET_WORKSPACE_PROJECTS](state, { count, results, next }) {
    state.workspaceProjects = {
      next,
      count,
      results: [...state.workspaceProjects.results, ...results]
    }
  },

  [mutation.SET_INITIAL_WORKSPACE_PROJECTS](state, { count, results, next }) {
    state.workspaceProjects = {
      next,
      count,
      results: [...results]
    }
  },

  [mutation.DELETE_WORKSPACE_PROJECT](state, projectToDelete) {
    const results = state.workspaceProjects.results.filter(project => project.short_uuid !== projectToDelete.short_uuid)
    state.workspaceProjects = {
      next: state.workspaceProjects.next,
      count: state.workspaceProjects.count - 1,
      results
    }
  },
  [mutation.SET_LOADING](state, value) {
    state.loading = { ...state.loading, ...value }
  },
  [mutation.UPDATE_SETTINGS](state, data) {
    state.workspaceSettings = Object.assign({}, state.workspaceSettings, data)
  },
  [mutation.SET_QUERY](state, { path, value }) {
    set(state, path, value)
  },
  [mutation.RESET](state) {
    state.workspaceProjects = {
      next: null,
      count: 0,
      results: []
    }
  },

  [mutation.SET_WORKSPACE_PEOPLE_INITIAL](state, data) {
    state.workspacePeople = data
  },

  [mutation.SET_WORKSPACE_PARAMS](state, { path, value }) {
    set(state, path, value)
  },

  [mutation.UPDATE_WORKSPACE_PEOPLE](state, data) {
    state.workspacePeople = [...state.workspacePeople, ...data]
  },

  [mutation.DELETE_WORKSPACE_PEOPLE](state, item) {
    state.workspacePeople.splice(state.workspacePeople.indexOf(item), 1)
  },

  [mutation.SET_INVITATION](state, data) {
    state.invitation = data
  },

  [mutation.RESET_INVITATION](state) {
    state.invitation = new InvitationModel().state
  },

  [mutation.SET_CURRENT_PEOPLE](state, data) {
    state.currentPeople = {
      ...state.currentPeople,
      ...data,
      permission: {
        ...state.currentPeople.permission,
        ...data.permission
      }
    }
  },

  [mutation.CHANGE_WORKSPACE_PEOPLE](state, item) {
    state.workspacePeople.splice(
      state.workspacePeople.map(people => people.short_uuid).indexOf(item.short_uuid),
      1,
      item
    )
  }
}
