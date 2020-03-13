import * as type from './types'
import { MutationTree } from 'vuex'
import { File, PackageState } from './types'

export const mutations: MutationTree<PackageState> = {
  [type.SET_PACKAGE](state, data) {
    const re = /(?:\.([^.]+))?$/
    const reducer = (acc: File[], cr: File) => {
      if (cr.name && cr.parent === '/') {
        const ext = re.exec(cr.name)

        cr.ext = (ext && typeof ext[1] !== 'undefined' && ext[1]) || 'txt'
        acc.push(cr)
      }

      return acc
    }
    const files = data.files.reduce(reducer, [])
    state.packageData = { ...data, files }
  }
}
