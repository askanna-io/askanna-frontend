import { TIMINGS } from '@/core/utils/const'
import * as type from '@/core/store/mutationTypes'

import { MutationTree } from 'vuex'
import { GlobalState } from './types'

export const mutations: MutationTree<GlobalState> = {
  [type.SET_SNACKBAR](state, params) {
    let { timeout, message = '' } = params

    if (!timeout) {
      timeout = message.length * TIMINGS.SNACKBAR_SYMBOL_READ_TIME
    }

    state.snackbar = {
      ...state.snackbar,
      ...params,
      ...{
        timeout,
        open: true
      }
    }
  },

  [type.CLOSE_SNACKBAR](state) {
    state.snackbar.open = false
  }
}
