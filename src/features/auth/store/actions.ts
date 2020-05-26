import axios from 'axios'
import { ac, mt } from './types'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import { AuthState } from './types'
import { api } from '@/core/services/api-settings'
import { apiStringify } from '@/core/services/api-settings'
import { AUTH_STORE } from '@/core/store/storeTypes'
import { logger } from '@/core/plugins/logger'

const serviceName = AUTH_STORE

export const actions: ActionTree<AuthState, RootState> = {
  async [ac.login]({ commit }, { username, password }) {
    const url = api.url() + api.auth.login()

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

    try {
      const result = await axios.post(url, { username, password })
      const { data } = result

      commit(mt.SET_AUTH, data)
      router.push({ path: '/workspace' })

      return data
    } catch (error) {
      logger.error(commit, 'Error on login action.\nError: ', error)

      if ((error && error.response && error.response.status === 400) || error.statusCode === 400) {
        const message = error.response.data.non_field_errors[0]
        logger.error(commit, 'Error on login action.\nError: ', message)

        return error
      }

      if (!error.statusCode) {
        return error.message
      }
      return error
    }
  },

  async [ac.logout]({ commit }) {
    try {
      await axios.post(api.url() + api.auth.logout({}))
    } catch (error) {
      router.push({ path: '/login' })
    }
    commit(mt.DROP_AUTH, null)

    router.push({ path: '/login' })
  }
}
