import { MutationTree } from 'vuex'
import { projectState } from './types'
import { mutation } from './types'

export const mutations: MutationTree<projectState> = {
  [mutation.SET_PROJECT](state, data) {
    state.project = data
  }
}
