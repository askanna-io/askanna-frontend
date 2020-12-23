import axios from 'axios'
import { ac, mt } from './types'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import { AuthState } from './types'
import * as Sentry from '@sentry/browser'
import { logger } from '@/core/plugins/logger'
import { api } from '@/core/services/api-settings'
import apiService from '@/core/services/apiService'
import { AUTH_STORE } from '@/core/store/storeTypes'
import { apiStringify } from '@/core/services/api-settings'

const serviceName = AUTH_STORE
const authApi = apiStringify('auth')
const apiAccounts = apiStringify('accounts')

export const actions: ActionTree<AuthState, RootState> = {
  async [ac.login]({ commit }, { username, password, redirect = true }) {
    const url = api.url() + api.auth.login()

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

    try {
      const result = await axios.post(url, { username, password })
      const { data } = result

      commit(mt.SET_AUTH, data)
      commit('workspace/SET_CURRENT_PEOPLE', { username, email: username, name: username, password }, { root: true })

      if (redirect) router.push({ name: 'check-access' })

      return data
    } catch (error) {
      logger.error(commit, 'Error on login action.\nError: ', error)

      if (error?.response?.data?.non_field_errors) {
        logger.userDanger(commit, error?.response?.data?.non_field_errors[0])
      }

      return error
    }
  },

  async [ac.logout]({ commit }, redirect = true) {
    try {
      await axios.post(api.url() + api.auth.logout({}))
    } catch (error) {
      logger.error(commit, 'Error on logout action.\nError: ', error)
    }
    commit(mt.DROP_AUTH, null)

    if (process.env.VUE_APP_SENTRY === 'on') {
      Sentry.configureScope(scope => scope.setUser(null))
    }

    if (redirect) router.push({ path: '/signin' })
  },

  async [ac.createAccount]({ commit }, data) {
    let response
    try {
      response = await apiService({
        action: apiAccounts.create,
        method: 'post',
        serviceName: 'accounts',
        data
      })
    } catch (e) {
      logger.error(commit, 'Error on create account in createAccount action.\nError: ', e)

      return e
    }

    return response
  },

  async [ac.getCurrentUser]({ state, commit }) {
    if (!state.authToken) return
    const url = api.url() + api.auth.currentUser()

    let result
    try {
      result = await axios.get(url)
    } catch (e) {
      logger.error(commit, 'Error on get current user in getCurrentUser action.\nError: ', e)

      return e
    }

    commit('workspace/SET_CURRENT_PEOPLE', result.data, { root: true })

    if (process.env.VUE_APP_SENTRY === 'on') {
      const { email, short_uuid: id, username } = result.data
      Sentry.setUser({ id, email, username })
    }

    return result
  },

  async [ac.resetPassword]({ commit }, payload) {
    const url = api.url() + api.auth.resetPassword()

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

    try {
      const result = await axios.post(url, payload)

      return result
    } catch (error) {
      logger.error(commit, 'Error on resetPassword action.\nError: ', error)

      return error
    }
  },

  async [ac.validateResetToken]({ commit }, params) {
    let result
    const url = api.url() + api.auth.validateResetToken()

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

    try {
      result = await axios.get(url, {
        params
      })
    } catch (error) {
      logger.error(commit, 'Error on validateResetToken action.\nError: ', error)

      return error
    }

    return result && result.data
  },

  async [ac.confirmResetPassword]({ commit }, payload) {
    const url = api.url() + api.auth.confirmResetPassword()

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

    try {
      const result = await axios.post(url, payload)

      logger.success(commit, `Your password has been reset successfully!`)

      return result
    } catch (error) {
      logger.error(commit, 'Error on confirmResetPassword action.\nError: ', error)

      return error
    }
  }
}
