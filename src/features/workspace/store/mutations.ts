import { mutation } from './types'
import { MutationTree } from 'vuex'
import { workspaceState } from './types'
import { set } from 'lodash'

export const mutations: MutationTree<workspaceState> = {
  [mutation.SET_WORKSPACE](state, data) {
    state.workspace = data
  },
  [mutation.SET_WORKSPACES](state, data) {
    state.workspaces = data
  },
  [mutation.SET_WORKSPACE_PROJECTS](state, { count, results: list, next }) {
    state.workspaceProjectsQuery.next = next
    state.workspaceProjects = {
      count,
      results: [...state.workspaceProjects.results, ...list]
    }
  },
  [mutation.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  },
  [mutation.UPDATE_SETTINGS](state, data) {
    state.workspaceSettings = Object.assign({}, state.workspaceSettings, data)
  },
  [mutation.UPDATE_PROJECTS](state, data) {
    state.workspaceProjects = {
      count: state.workspaceProjects.count + 1,
      results: state.workspaceProjects.results.concat(data)
    }
  },
  [mutation.SET_QUERY](state, { path, value }) {
    set(state, path, value)
  },
  [mutation.RESET](state) {
    state.workspaceProjectsQuery = {
      limit: 18,
      offset: 0,
      next: null
    }

    state.workspaceProjects = {
      count: 0,
      results: []
    }
  }
}
