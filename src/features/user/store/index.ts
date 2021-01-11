import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { userState, USER_STORE } from './types'

export const state: userState = {
  accounts: [],
  userProfile: {
    name: '',
    email: '',
    password: undefined,
    short_uuid: ''
  },
  tempAuth: {
    username: '',
    password: ''
  }
}

const namespaced: boolean = true
export const name: string = USER_STORE
export const user: Module<userState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
