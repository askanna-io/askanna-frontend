import * as type from './types'
import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import { PackageState, PACKAGE_STORE, packageServiceName } from './types'
import { apiStringify } from '@/core/services/api-settings'
import * as rootTypes from '@/core/store/actionTypes'
import apiService from '@/core/services/apiService'

const root = true
const serviceName = packageServiceName
const api = apiStringify(serviceName)

export const actions: ActionTree<PackageState, RootState> = {
  async [type.getPackage]({ commit }, uuid) {
    let packageData
    try {
      packageData = await apiService({
        action: api.get,
        serviceName,
        uuid
      })
    } catch (e) {
      logger.error(commit, 'Error on load packageData in getPackage action.\nError: ', e)

      return
    }
    commit(type.SET_PACKAGE, { packageData })
  },

  async [type.getFileSource]({ dispatch, state, commit }, path) {
    if (!path) return commit(type.SET_FILE, '')
    if (!state.packageData) return commit(type.SET_FILE, '')

    const url = `${state.packageData.cdn_base_url}/${path}`

    let fileSource
    try {
      fileSource = await dispatch(
        rootTypes.apiDownloadSerice,
        {
          url
        },
        { root }
      )
    } catch (e) {
      logger.error(commit, 'Error on load fileSource in getFileSource action.\nError: ', e)
      return
    }

    const file = await fileSource.text()

    commit(type.SET_FILE, { file, fileSource })
  },

  async [type.uploadPackage]({ commit }, data) {
    let packageData
    try {
      packageData = await apiService({
        action: api.uploadPackage,
        method: 'post',
        serviceName,
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on upload package in uploadPackage action.\nError: ', e)

      return
    }
    return packageData
  },

  async [type.finishUpload]({ commit }, { uuid, data }) {
    let result
    try {
      result = await apiService({
        action: api.finishUpload,
        method: 'post',
        serviceName,
        uuid,
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on finish upload package in finishUpload action.\nError: ', e)

      return
    }
    return result
  }
}
