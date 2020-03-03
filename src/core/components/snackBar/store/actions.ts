import { ActionTree } from 'vuex'
import { SnackbarState, ac, mt } from './types'

export const actions: ActionTree<SnackbarState, RootState> = {
  [ac.showSnackBar]({ commit }, params) {
    commit(mt.SET_SNACKBAR, params)
  },
  [ac.closeSnackBar]({ commit }) {
    commit(mt.CLOSE_SNACKBAR)
  }
}
