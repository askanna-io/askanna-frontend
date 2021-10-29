import axios from 'axios'
import { ActionTree } from 'vuex'
import * as Sentry from '@sentry/browser'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { api, apiStringify } from '@/core/services/api-settings'

import { userState, USER_STORE, stateType, action as ac, mutation as mt } from './types'

const serviceName = USER_STORE
const apiActions = apiStringify(serviceName)

export const actions: ActionTree<userState, RootState> = {
  async [ac.getUserProfile]({ commit }) {
    const url = api.url() + api.points.user.getProfile({})

    let result
    try {
      result = await axios.get(url)
    } catch (e) {
      logger.error(commit, 'Error on get current user profile in getUserProfile action.\nError: ', e)

      return e
    }
    if (!result) {
      return
    }

    commit(mt.SET_USER_PROFILE, result.data)

    if (process.env.VUE_APP_SENTRY === 'on') {
      const { email, short_uuid: id, username } = result.data
      Sentry.setUser({ id, email, username })
    }

    return result
  },

  async [ac.updateProfile]({ commit }, { uuid, data }) {
    let user
    try {
      user = await apiService({
        method: 'PATCH',
        uuid,
        data,
        action: apiActions.updateAccount,
        serviceName
      })
    } catch (error) {
      logger.error(commit, 'Error on update user profile in updateProfile action.\nError: ', error)

      return error
    }

    commit(mt.SET_USER_PROFILE, user)

    return user
  },

  async [ac.getAccounts]({ commit }) {
    let accounts
    try {
      accounts = await apiService({
        action: apiActions.getAccounts,
        serviceName
      })
    } catch (error) {
      logger.error(commit, 'Error on get getAccounts in getAccounts action.\nError: ', error)

      return error
    }

    commit(mt.SET_ACCOUNTS, accounts)

    return accounts
  },

  async [ac.getGlobalProfile]({ commit }) {
    let profile
    try {
      profile = await apiService({
        serviceName,
        action: apiActions.globalProfile
      })
    } catch (error) {
      logger.error(commit, 'Error on get global profile in getGlobalProfile action.\nError: ', error)

      return error
    }

    commit(mt.SET_GLOBAL_PROFILE, profile)
  },

  async [ac.updateGlobalProfile]({ commit }, data) {
    let profile
    try {
      profile = await apiService({
        data,
        serviceName,
        method: 'PATCH',
        action: apiActions.globalProfile
      })
    } catch (error) {
      logger.error(commit, 'Error on update global profile in updateGlobalProfile action.\nError: ', error)

      return error
    }

    commit(mt.SET_GLOBAL_PROFILE, profile)

    return profile
  },

  async [ac.updateGlobalAvatar]({ commit }, data) {
    let result

    try {
      result = await apiService({
        data,
        serviceName,
        method: 'PATCH',
        action: apiActions.globalProfileAvatar
      })
    } catch (e) {
      logger.error(commit, 'Error on update global avatar in updateGlobalAvatar action.\nError: ', e)

      return e
    }

    return result
  }
}
