import { set, get } from 'lodash'
import * as type from './types'
import { MutationTree } from 'vuex'
import { File, PackageState } from './types'

export const mutations: MutationTree<PackageState> = {
  [type.SET_PACKAGE](state, { packageData: data, uuid: { folderName } }) {
    const re = /(?:\.([^.]+))?$/
    const files = data.files.map((file: File) => {
      const fileExt = re.exec(file.name)
      const ext = (!file.is_dir && fileExt && typeof fileExt[1] !== 'undefined' && fileExt[1]) || 'txt'

      return { ...file, ext }
    })

    state.packageData = { ...data, files }
  }
}
