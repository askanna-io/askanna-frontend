import * as type from './types'
import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import { PackageState, PACKAGE_STORE, packageServiceName } from './types'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'

const root = true
const serviceName = packageServiceName
const api = apiStringify(serviceName)

export const actions: ActionTree<PackageState, RootState> = {
  async [type.getPackage]({ commit, dispatch }, uuid) {
    let packageData
    try {
      packageData = await dispatch(
        rootTypes.apiService,
        {
          action: api.get,
          serviceName,
          uuid
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load packageData in getPackage action.\nError: ', e)

      return
    }
    commit(type.SET_PACKAGE, { packageData, uuid })
  }
}
