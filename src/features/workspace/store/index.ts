import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { workspaceState, WORKSPACE_STORE, PersonModel, WorkspaceModel, InvitationModel } from './types'

export const state: workspaceState = {
  workspace: new WorkspaceModel().state,
  workspaces: {
    count: 0,
    results: []
  },
  workspaceProjects: {
    count: 0,
    next: null,
    results: [
      {
        uuid: 'f1823c3b-e9e7-47bb-a610-5462c9cd9767',
        short_uuid: '7Lif-Rhcn-IRvS-Wv7J',
        name: 'AskAnna Core',
        description: null,
        workspace: {
          relation: 'workspace',
          name: 'AskAnna',
          uuid: '695fcc8b-ba8c-4575-a1e0-f0fcfc70a349',
          short_uuid: '3Cpy-QMzd-MVko-1rDQ'
        },
        package: {
          uuid: 'e88ce57e-ea32-49d3-b2bb-5b0dbff54e3a',
          short_uuid: '74ob-nmw4-tB4j-H2cU',
          name: 'askanna_core.zip'
        },
        notifications: {
          all: {
            email: []
          },
          error: {
            email: []
          }
        },
        template: null,
        created_by: {
          uuid: null,
          short_uuid: null,
          name: null
        },
        created: '2021-08-02T07:46:36.709870Z',
        modified: '2021-09-01T11:22:18.301599Z',
        url: 'https://env-301-global-me-hsclya.askanna.eu/3Cpy-QMzd-MVko-1rDQ/project/7Lif-Rhcn-IRvS-Wv7J'
      }
    ]
  },
  workspaceQuery: {
    limit: 1000,
    offset: 0
  },
  loading: {
    people: false,
    projects: false,
    workspaces: false
  },
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
  invitation: new InvitationModel().state,
  currentPeople: new PersonModel().state
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
