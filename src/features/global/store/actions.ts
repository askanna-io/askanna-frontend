import { ActionTree } from 'vuex'
import { GlobalState } from './types'

import * as mt from '@/core/store/mutationTypes'
import * as actionType from '@/core/store/actionTypes'

export const actions: ActionTree<GlobalState, RootState> = {
  [actionType.showSnackBar]({ commit }, params) {
    commit(mt.SET_SNACKBAR, params)
  },
  [actionType.closeSnackBar]({ commit }) {
    commit(mt.CLOSE_SNACKBAR)
  }
}
