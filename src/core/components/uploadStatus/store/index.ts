import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { UploadStatusState } from './types'

export const state: UploadStatusState = {
  uploads: [],
  snackbar: {
    open: false,
    color: 'primary',
    message: '',
    timeout: -1,
    top: false,
    right: true,
    left: false,
    bottom: true,
    multiLine: true
  }
}

const namespaced: boolean = true
export const name: string = 'uploadStatus'
export const uploadStatus: Module<UploadStatusState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

export interface Snackbar {
  top: boolean
  color: string
  left: boolean
  open: boolean
  right: boolean
  bottom: boolean
  timeout: number
  message: string
  multiLine: boolean
}

export const uploadStatusStoreName = 'uploadStatus'
