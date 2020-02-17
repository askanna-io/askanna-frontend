import { MutationTree } from 'vuex'
import { JobsState } from './types'
import * as type from './types'

export const mutations: MutationTree<JobsState> = {
  [type.SET_JOBS_LIST](state, data) {
    state.list = data
  }
}
