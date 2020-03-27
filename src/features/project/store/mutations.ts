import { mutation } from './types'
import { MutationTree } from 'vuex'
import { projectState } from './types'

export const mutations: MutationTree<projectState> = {
  [mutation.SET_PROJECT](state, data) {
    state.project = data
  },
  [mutation.SET_PROJECTS](state, data) {
    state.projects = data
  },
  [mutation.SET_PROJECT_JOBS](state, data) {
    state.projectJobs = data
  },
  [mutation.RESET_PORJECT_JOBS](state) {
    state.projectJobs = []
  }
}
