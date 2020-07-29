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
  createProject: {
    name: 'Put test',
    workspace: '3Cpy-QMzd-MVko-1rDQ'
  }
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
