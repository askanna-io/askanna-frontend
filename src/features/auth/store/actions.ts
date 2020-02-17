import axios from 'axios'
import { AxiosRequestConfig } from 'axios'

import router from '@/core/router'

import * as mt from '@/core/store/mutationTypes'
import { apiStringify } from '@/core/api-settings'
import { api } from '@/core/api-settings'
import * as actionType from '@/core/store/actionTypes'

import { ActionTree } from 'vuex'
import { AuthState } from './types'

import { AUTH_STORE } from '@/core/store/storeTypes'

const root = true
const serviceName = AUTH_STORE
const apiString = apiStringify(serviceName)

export const actions: ActionTree<AuthState, RootState> = {
  async [actionType.login]({ commit, dispatch, rootState }, { username, password }) {
    const url = api.url() + api.auth.login()

    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

    try {
      const result = await axios.post(url, { username, password })
      const { data } = result

      commit(mt.SET_AUTH, data)

      return data
      // router.push({ path: '/' })
    } catch (error) {
      if ((error && error.response && error.response.status === 400) || error.statusCode === 400) {
        const message = error.response.data.non_field_errors[0]
        dispatch(`global/${actionType.showSnackBar}`, { message }, { root })

        return error
      }

      if (!error.statusCode) {
        return error.message
      }

      return error
    }
  },

  async [actionType.logout]({ commit, dispatch }) {
    try {
      await dispatch(
        actionType.apiService,
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
