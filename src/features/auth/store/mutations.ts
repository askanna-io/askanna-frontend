import { MutationTree } from 'vuex'
import { AuthState } from './types'
import * as mt from '@/core/store/mutationTypes'

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
