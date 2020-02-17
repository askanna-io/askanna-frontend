import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { projectState, PROJECT_STORE, ProjectModel } from './types'

export const state: projectState = {
  project: new ProjectModel().state
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
