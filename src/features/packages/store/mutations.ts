import * as type from './types'
import { MutationTree } from 'vuex'
import { PackagesState } from './types'

export const mutations: MutationTree<PackagesState> = {
  [type.SET_PROJECT_PACKAGES](state, data) {
    state.projectPackages = data
  }
}
