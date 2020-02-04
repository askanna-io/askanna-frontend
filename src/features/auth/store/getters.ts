import { GetterTree } from 'vuex'
import { AuthState } from './types'

export const getters: GetterTree<AuthState, RootState> = {
  getAuthToken(state) {
    return state.authToken
  }
}
