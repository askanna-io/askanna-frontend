import { set } from 'lodash'
import { MutationTree } from 'vuex'
import { mutation, generalState, stateType } from './types'

export const mutations: MutationTree<generalState> = {
  [mutation.SET_BREADCRUMB_PARAMS](state, data) {
    state.breadcrumbParams = { ...state.breadcrumbParams, ...data }
  }
}
