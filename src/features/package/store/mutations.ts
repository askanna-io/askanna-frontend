import * as type from './types'
import { MutationTree } from 'vuex'
import { File, PackageState } from './types'

export const mutations: MutationTree<PackageState> = {
  [type.SET_PACKAGE](state, { packageData: data }) {
    const re = /(?:\.([^.]+))?$/
    const files = data.files.map((file: File) => {
      const fileExt = re.exec(file.name)
      const ext = (!file.is_dir && fileExt && typeof fileExt[1] !== 'undefined' && fileExt[1]) || 'txt'

      return { ...file, ext }
    })

    state.packageData = { ...data, files }
  },

  [type.SET_FILE](state, { file, fileSource }) {
    state.file = file
    state.fileSource = fileSource
  }
}
