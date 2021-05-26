import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { projectState, PROJECT_STORE, ProjectModel } from './types'

export const state: projectState = {
  project: new ProjectModel().state,
  projects: {
    count: 0,
    results: []
  },
  projectJobs: [],
  query: {
    limit: 10,
    offset: 0
  },
  jobsLoading: true,
  lastPackage: {
    short_uuid: ''
  },
  menu: {
    isSticked: true,
    isShowProjectBar: false,
    sticked: false
  },
  projectLoading: true,
  projectsLoading: true,
  projectTemplates: [
    {
      created: '',
      deleted: null,
      modified: '',
      name: 'Blank project (no template used)',
      scope: null,
      short_uuid: '',
      template_location: '',
      uuid: ''
    }
  ]
}

const namespaced: boolean = true
export const name: string = PROJECT_STORE
export const project: Module<projectState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
