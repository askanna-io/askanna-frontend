import { MutationTree } from 'vuex'
import { mt, AuthState } from './types'

export const mutations: MutationTree<AuthState> = {
  [mt.SET_AUTH](state, authData) {
    state.userId = authData.userId
    state.authToken = authData.key
    localStorage.setItem('token', authData.key)
  },
  [mt.DROP_AUTH](state) {
    state.userId = ''
    state.authToken = ''
    state.refreshToken = ''
    state.tokenExpires = ''
    localStorage.setItem('token', '')
  }
}
