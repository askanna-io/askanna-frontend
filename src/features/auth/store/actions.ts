import axios from 'axios'
import { ac, mt } from './types'
import { ActionTree } from 'vuex'
import router from '@/core/router'
import { AuthState } from './types'
import { api } from '@/core/api-settings'
import { apiStringify } from '@/core/api-settings'
import { AUTH_STORE } from '@/core/store/storeTypes'
import * as gbTypes from '@/core/store/actionTypes'
import { logger } from '@/core/plugins/logger'

const root = true
const serviceName = AUTH_STORE
const apiString = apiStringify(serviceName)

export const actions: ActionTree<AuthState, RootState> = {
  async [ac.login]({ commit, dispatch }, { username, password }) {
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
      logger.error('Error on login action.\nError: ', error)

      if ((error && error.response && error.response.status === 400) || error.statusCode === 400) {
        const message = error.response.data.non_field_errors[0]
        dispatch(`snackbar/${gbTypes.ac.showSnackBar}`, { message }, { root })

        return error
      }

      if (!error.statusCode) {
        return error.message
      }
      return error
    }
  },

  async [ac.logout]({ commit, dispatch }) {
    try {
      await dispatch(
        gbTypes.apiService,
        {
          action: apiString.logout,
          method: 'post',
          serviceName
        },
        { root }
      )
    } catch (error) {
      router.push({ path: '/login' })
    }
    commit(mt.DROP_AUTH, null)

    router.push({ path: '/login' })
  }
}
