import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { PackageState, PACKAGE_STORE, PackageModel } from './types'

export const state: PackageState = {
  packageData: new PackageModel().state,
  file: '',
  fileSource: new Blob()
}

const namespaced: boolean = true
export const name: string = PACKAGE_STORE
export const packageStore: Module<PackageState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
