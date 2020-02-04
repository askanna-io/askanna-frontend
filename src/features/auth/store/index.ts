import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { AuthState, authStoreName } from './types'

export const state: AuthState = {
  userId: '',
  userRole: '',
  authToken: '',
  refreshToken: '',
  tokenExpires: ''
}

const namespaced: boolean = true
export const name: string = authStoreName
export const auth: Module<AuthState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
