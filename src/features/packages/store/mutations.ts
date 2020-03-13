import * as type from './types'
import { MutationTree } from 'vuex'
import { Package, PackagesState } from './types'

export const mutations: MutationTree<PackagesState> = {
  [type.SET_PROJECT_PACKAGES](state, data) {
    data = data.map((el: Package, versionId: number) => {
      return { ...el, versionId }
    })
    const projectPackages = data.pop()

    state.projectPackages = [projectPackages]
    state.projectPackageHistory = data
  }
}
