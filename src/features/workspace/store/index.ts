import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { workspaceState, WORKSPACE_STORE, WorkspaceModel, InvitationModel } from './types'

export const state: workspaceState = {
  workspace: new WorkspaceModel().state,
  workspaces: {
    count: 0,
    results: []
  },
  workspaceProjects: {
    count: 0,
    next: null,
    results: []
  },
  workspaceQuery: {
    limit: 10,
    offset: 0
  },
  workspacesLoading: true,
  workspacePeopleLoading: true,
  workspaceProjectsLoading: true,
  workspaceSettings: {
    projectView: 0
  },
  workspacePeople: [],
  workspacePeopleParams: {
    search: '',
    sorting: {
      sortBy: 'name',
      sort: 1
    },
    filter: {
      role: '',
      status: ''
    }
  },
  invitation: new InvitationModel().state
}

const namespaced: boolean = true
export const name: string = WORKSPACE_STORE
export const workspace: Module<workspaceState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
