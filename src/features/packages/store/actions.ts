import * as type from './types'
import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import { PackagesState, PACKAGES_STORE } from './types'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'

const root = true
const serviceName = PACKAGES_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<PackagesState, RootState> = {
  async [type.getProjectPackages]({ commit, dispatch }, uuid) {
    let packages
    try {
      packages = await dispatch(
        rootTypes.apiService,
        {
          action: api.projectPackages,
          serviceName,
          uuid
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load packages in getProjectPackages action.\nError: ', e)
      return
    }
    commit(type.SET_PROJECT_PACKAGES, packages)
  },

  async [type.downloadPackage]({ commit, dispatch }, uuid) {
    let packageSource
    try {
      packageSource = await dispatch(
        rootTypes.apiService,
        {
          action: api.getDownloadLink,
          serviceName,
          uuid
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load packageSource in downloadPackage action.\nError: ', e)
      return
    }

    console.log(packageSource)
    return packageSource
  }
}
