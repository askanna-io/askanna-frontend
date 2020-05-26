import * as type from './types'
import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'

import { PackagesState, PACKAGES_STORE } from './types'
import { apiStringify } from '@/core/services/api-settings'
import * as rootTypes from '@/core/store/actionTypes'

const root = true
const serviceName = PACKAGES_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<PackagesState, RootState> = {
  async [type.getProjectPackages]({ commit }, uuid) {
    let packages
    try {
      packages = await apiService({
        action: api.projectPackages,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on load packages in getProjectPackages action.\nError: ', e)
      return
    }
    commit(type.SET_PROJECT_PACKAGES, packages)
  },

  async [type.getTargetPackage]({ commit }, uuid) {
    let packageTarget
    try {
      packageTarget = await apiService({
        action: api.getDownloadLink,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on load packageTarget in getTargetPackage action.\nError: ', e)
      return
    }

    return packageTarget.target || ''
  },

  async [type.downloadPackage]({ dispatch, commit }, uuid) {
    const url = await dispatch(type.getTargetPackage, uuid)

    let packageSource
    try {
      packageSource = await dispatch(
        rootTypes.apiDownloadSerice,
        {
          url
        },
        { root }
      )
    } catch (e) {
      logger.error(commit, 'Error on load packageSource in downloadPackage action.\nError: ', e)
      return
    }

    return packageSource
  },

  async [type.resetStore]({ commit }) {
    commit(type.RESET_STORE)
  }
}
