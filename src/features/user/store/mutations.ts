import { set } from 'lodash'
import { mutation } from './types'
import { MutationTree } from 'vuex'
import { userState, InvitationModel } from './types'

export const mutations: MutationTree<userState> = {
  [mutation.SET_USER_PROFILE](state, data) {
    state.userProfile = data
  },
  [mutation.SET_TEMP_AUTH](state, data) {
    state.tempAuth = data
  },
  [mutation.DELETE_TEMP_AUTH](state) {
    state.tempAuth = { username: '', password: '' }
  },
  [mutation.DELETE_PASSWORD](state) {
    state.userProfile = { ...state.userProfile, password: undefined }
  },
  [mutation.SET_ACCOUNTS](state, data) {
    state.accounts = data
  }
}
