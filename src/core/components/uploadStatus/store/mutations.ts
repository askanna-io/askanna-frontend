import { MutationTree } from 'vuex'
import { mt, TIMINGS, UploadStatusState } from './types'

export const mutations: MutationTree<UploadStatusState> = {
  [mt.SET_SNACKBAR](state, params) {
    state.snackbar = {
      ...state.snackbar,
      ...params
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
  },

  [mt.ADD_UPLOAD](state, data) {
    state.snackbar = {
      ...state.snackbar,
      open: true,
      message: ''
    }

    const item = {
      ...state.snackbar,
      ...data,
      open: true
    }
    state.uploads.push(item)
  },

  [mt.SET_UPLOAD](state, data) {
    const index = state.uploads.findIndex(item => item.id === data.id)
    const item = state.uploads[index]

    state.uploads.splice(index, 1, { ...item, ...data, message: '' })
  },

  [mt.CLEAR_UPLOAD](state) {
    state.uploads = []
    state.snackbar.message = "You don't have tasks yet."
  }
}
