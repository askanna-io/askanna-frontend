import { MutationTree } from 'vuex'
import { mt, TIMINGS, SnackbarState } from './types'

export const mutations: MutationTree<SnackbarState> = {
  [mt.SET_SNACKBAR](state, params) {
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

  [mt.CLOSE_SNACKBAR](state) {
    state.snackbar = {
      ...state.snackbar,
      ...{
        message: '',
        open: false
      }
    }
  }
}
