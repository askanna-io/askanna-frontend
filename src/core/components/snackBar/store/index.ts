import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'

export const state: SnackbarState = {
  snackbar: {
    open: false,
    color: '',
    message: '',
    timeout: 6000,
    top: true,
    right: true,
    left: false,
    bottom: false,
    multiLine: true
  }
}

const namespaced: boolean = true
export const name: string = 'snackbar'
export const snackbar: Module<SnackbarState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

// types
export interface SnackbarState {
  snackbar: Snackbar
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

export const snackbarStoreName = 'snackbar'
