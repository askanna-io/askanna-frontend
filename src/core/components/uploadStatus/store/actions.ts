import { ActionTree } from 'vuex'
import { UploadStatusState, ac, mt } from './types'

export const actions: ActionTree<UploadStatusState, RootState> = {
  [ac.showHideSnackBar]({ commit, state }, params) {
    const message = state.uploads.length ? '' : "You don't have tasks yet."
    commit(mt.SET_SNACKBAR, { open: !state.snackbar.open, ...params, message })
  },
  [ac.showSnackBar]({ commit }, params) {
    commit(mt.SET_SNACKBAR, params)
  },
  [ac.closeSnackBar]({ commit }) {
    commit(mt.CLOSE_SNACKBAR)
  },
  [ac.addUpload]({ commit }, data) {
    commit(mt.ADD_UPLOAD, data)
  },
  [ac.setUpload]({ commit }, data) {
    commit(mt.SET_UPLOAD, data)
  },
  [ac.clearSnackBar]({ commit }) {
    commit(mt.CLEAR_UPLOAD)
  }
}
