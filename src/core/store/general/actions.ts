import { ActionTree } from 'vuex'
import { action, mutation, generalState } from './types'

export const actions: ActionTree<generalState, RootState> = {
  async [action.setBreadcrumbParams]({ commit }, data) {
    commit(mutation.SET_BREADCRUMB_PARAMS, data)
  }
}
