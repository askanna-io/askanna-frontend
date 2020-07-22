import { set } from 'lodash'
import * as type from './types'
import { MutationTree } from 'vuex'
import { Package, PackagesState } from './types'

export const mutations: MutationTree<PackagesState> = {
  [type.SET_PROJECT_PACKAGES](state, data) {
    if (!data.length) {
      state.projectPackages = []
      state.projectPackageHistory = []
      return
    }
    data = data.map((el: Package, versionId: number) => {
      return { ...el, versionId }
    })
    const [projectPackages] = data.slice(0, 1)

    state.projectPackages = projectPackages
    state.projectPackageHistory = data
  },

  [type.RESET_STORE](state) {
    state.projectPackages = []
    state.projectPackageHistory = []
  },

  [type.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  }
}
