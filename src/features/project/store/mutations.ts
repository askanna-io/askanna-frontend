import { set } from 'lodash'
import { mutation, ProjectVisibility } from './types'
import { MutationTree } from 'vuex'
import { projectState, ProjectModel } from './types'

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
  },
  [mutation.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  },
  [mutation.SET_LAST_PACKAGE](state, data) {
    state.lastPackage = data
  },
  [mutation.SET_MENU](state, { name = 'menu.isShowProjectBar', value }) {
    set(state, name, value)
  },
  [mutation.UPDATE_PROJECTS](state, data) {
    state.projects = {
      next: state.projects.next,
      count: state.projects.count + 1,
      previous: state.projects.previous,
      results: state.projects.results.concat(data)
    }
  },
  [mutation.SET_PROJECT_DATA](state, { path, value }) {
    set(state, `project.${path}`, value)
  },
  [mutation.RESET_PROJECT_DATA](state) {
    state.project = new ProjectModel().state
  },
  [mutation.SET_PROJECT_TEMPLATES](state, data) {
    state.projectTemplates = [...state.projectTemplates, ...data]
  }
}
