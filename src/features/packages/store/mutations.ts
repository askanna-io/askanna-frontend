import { set } from 'lodash'
import * as type from './types'
import { MutationTree } from 'vuex'
import { Package, PackagesState } from './types'

export const mutations: MutationTree<PackagesState> = {
  [type.SET_PROJECT_PACKAGES](state, { count, results, next }) {
    state.projectPackages = {
      next,
      count,
      results: [...state.projectPackages.results, ...results]
    }
  },

  [type.RESET_STORE](state) {
    state.projectPackages = {
      next: null,
      count: 0,
      results: []
    }
  },

  [type.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  }
}
