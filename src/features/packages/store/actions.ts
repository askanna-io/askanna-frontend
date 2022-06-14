import * as type from './types'
import { action, stateType } from './types'
import { ActionTree } from 'vuex'
import { useLogger } from '@/core/composition/useLogger'
import apiService from '@/core/services/apiService'

import { PackagesState, PACKAGES_STORE } from './types'
import { apiStringify } from '@/core/services/api-settings'
import * as rootTypes from '@/core/store/actionTypes'

const root = true
const serviceName = PACKAGES_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<PackagesState, RootState> = {
  async [action.getInitialProjectPackages]({ commit, dispatch }, params) {
    commit(type.SET_LOADING, { name: stateType.loadingPackages, value: true })
    await dispatch(action.getProjectPackages, params)

    commit(type.SET_LOADING, { name: stateType.loadingPackages, value: false })
  },

  async [action.getProjectPackages]({ commit }, { params, uuid }) {
    let packages
    try {
      packages = await apiService({
        action: api.projectPackages,
        serviceName,
        uuid,
        params
      })
    } catch (e) {
      const logger = useLogger()

      logger.error('Error on load packages in getProjectPackages action.\nError: ', e)
      return
    }
    commit(type.SET_PROJECT_PACKAGES, packages)
  },

  async [action.getTargetPackage]({ commit }, uuid) {
    let packageTarget
    try {
      packageTarget = await apiService({
        action: api.getDownloadLink,
        serviceName,
        uuid
      })
    } catch (e) {
      const logger = useLogger()

      logger.error('Error on load packageTarget in getTargetPackage action.\nError: ', e)
      return
    }

    return packageTarget.target || ''
  },

  async [action.downloadPackage]({ dispatch, commit }, uuid) {
    const url = await dispatch(action.getTargetPackage, uuid)

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
      const logger = useLogger()

      logger.error('Error on load packageSource in downloadPackage action.\nError: ', e)
      return
    }

    return packageSource
  },

  async [action.resetStore]({ commit }) {
    commit(type.RESET_STORE)
  }
}
