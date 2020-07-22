import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { PackagesState, PACKAGES_STORE } from './types'

export const state: PackagesState = {
  projectPackages: [],
  projectPackageHistory: [],
  loadingPackages: true
}

const namespaced: boolean = true
export const name: string = PACKAGES_STORE
export const packages: Module<PackagesState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
