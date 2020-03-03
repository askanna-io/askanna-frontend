import * as type from './types'
import { MutationTree } from 'vuex'
import { JobsState } from './types'

export const mutations: MutationTree<JobsState> = {
  [type.SET_JOBS_LIST](state, data) {
    state.list = data
  },

  [type.UDPDATE_LIST](state, { data, index }) {
    state.list.splice(index, 1, data)
  }
}
