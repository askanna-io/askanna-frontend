import { MutationTree } from 'vuex'
import { mutation, generalState, stateType } from './types'

export const mutations: MutationTree<generalState> = {
  [mutation.SET_BREADCRUMB_PARAMS](state, data) {
    state.breadcrumbParams = { ...state.breadcrumbParams, ...data }
  },

  [mutation.SET_INTERVAL](state, { key, handler }: { key: string; handler: TimerHandler }) {
    state.interval.set(key, setInterval(handler, 5000))
  },

  [mutation.CLEAR_INTERVAL](state, key) {
    const id = state.interval.get(key)
    clearInterval(id)

    state.interval.delete(key)
  }
}
