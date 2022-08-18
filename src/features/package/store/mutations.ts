import { set } from 'lodash'
import * as type from './types'
import { MutationTree } from 'vuex'
import { File, PackageState } from './types'

export const mutations: MutationTree<PackageState> = {
  [type.SET_PACKAGE](state, { packageData: data }) {
    const re = /(?:\.([^.]+))?$/
    const files = data.files.map((file: File) => {
      const fileExt = re.exec(file.name)
      const ext = (file.type === 'file' && fileExt && typeof fileExt[1] !== 'undefined' && fileExt[1]) || 'txt'

      return { ...file, ext }
    })

    state.packageData = { ...data, files }
  },

  [type.SET_PROCESSING_LIST](state, uuid) {
    const found = state.processingList.find(item => item.packageId === uuid.packageId)

    if (!found) {
      state.processingList.push(uuid)
    }
  },

  [type.REMOVE_FROM_PROCESSING_LIST](state, uuid) {
    state.processingList = state.processingList.filter(item => item.packageId !== uuid.packageId)
  },

  [type.SET_LOADING](state, { name, value }) {
    set(state, name, value)
  }
}
