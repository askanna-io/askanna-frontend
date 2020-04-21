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
  [mutation.SET_WORKSPACE_PROJECTS](state, data) {
    state.workspaceProjects = data
  },
  [mutation.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  },

  [mutation.UPDATE_SETTINGS](state, data) {
    state.workspaceSettings = Object.assign({}, state.workspaceSettings, data)
  }
}
