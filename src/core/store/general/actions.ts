import { ActionTree } from 'vuex'
import { action, mutation, generalState } from './types'

export const actions: ActionTree<generalState, RootState> = {
  async [action.setBreadcrumbParams]({ commit }, data) {
    commit(mutation.SET_BREADCRUMB_PARAMS, data)
  },

  async [action.setInterval]({ commit }, { key, handler }: { key: string; handler: TimerHandler }) {
    commit(mutation.SET_INTERVAL, { key, handler })
  },

  async [action.clearInterval]({ commit }, key) {
    commit(mutation.CLEAR_INTERVAL, key)
  }
}
