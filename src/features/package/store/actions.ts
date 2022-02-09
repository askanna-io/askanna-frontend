import * as type from './types'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import VueRouter from 'vue-router'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import * as rootTypes from '@/core/store/actionTypes'
import { PackageState, packageServiceName } from './types'
import { apiStringify } from '@/core/services/api-settings'
const { isNavigationFailure, NavigationFailureType } = VueRouter

const root = true
const serviceName = packageServiceName
const api = apiStringify(serviceName)

export const actions: ActionTree<PackageState, RootState> = {
  async [type.getPackage]({ commit }, { loading, failedRoute, ...uuid }) {
    if (loading) commit(type.SET_LOADING, { name: 'packageLoading', value: true })

    let packageData
    try {
      packageData = await apiService({
        action: api.get,
        serviceName,
        uuid,
        params: { limit: 1, offset: 0 }
      })
    } catch (e) {
      if (e.response && e.response.status === 500) {
        commit(type.SET_PROCESSING_LIST, uuid)
        commit(type.SET_PACKAGE, {
          packageData: {
            files: []
          }
        })
        if (loading) commit(type.SET_LOADING, { name: 'packageLoading', value: false })

        return
      }

      const name = failedRoute || 'workspace-project-code-does-not-exist'
      router.push({ name }).catch(failure => {
        if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
          logger.error(commit, 'Error on redirect to workspace-project-code-does-not-exist.\nError: ', failure)
        }
      })

      if (loading) commit(type.SET_LOADING, { name: 'packageLoading', value: false })

      logger.error(commit, 'Error on load packageData in getPackage action.\nError: ', e)

      return
    }

    commit(type.REMOVE_FROM_PROCESSING_LIST, uuid)
    commit(type.SET_PACKAGE, { packageData })
    commit(type.SET_LOADING, { name: 'packageLoading', value: false })
  },

  async [type.registerPackage]({ commit }, data) {
    let packageData
    try {
      packageData = await apiService({
        action: api.registerPackage,
        method: 'post',
        serviceName,
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on upload package in registerPackage action.\nError: ', e)

      return
    }
    return packageData
  },

  async [type.registerChunkPackage]({ commit }, { uuid, data }) {
    let result
    try {
      result = await apiService({
        action: api.registerChunkPackage,
        method: 'post',
        serviceName,
        uuid,
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on finish register chunck package in registerChunkPackage action.\nError: ', e)
    }

    return result
  },

  async [type.finishUpload]({ commit }, { uuid, data }) {
    let result
    // convert the data to formdata for proper file upload
    const formData = new FormData()

    type CalType = (name: any, value: any) => void
    const callback: CalType = ([name, value]) => formData.append(name, value)

    Object.entries(data).forEach(callback)

    try {
      result = await apiService({
        action: api.finishUpload,
        method: 'post',
        serviceName,
        uuid,
        data: formData
      })
    } catch (e) {
      logger.error(commit, 'Error on finish upload package in finishUpload action.\nError: ', e)

      return
    }
    return result
  }
}
