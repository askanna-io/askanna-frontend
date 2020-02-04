import Vue from 'vue'
import { $axios } from '@/main'

import { api } from '../api-settings'
import Vuex, { StoreOptions } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as at from './actionTypes'
import * as mt from './mutationTypes'

// find all store modules from features folder
const stores: any = {}
const modules = require.context('@/features', true, /store\/index$/)
const moduleKeys = modules.keys()

for (const modulePath of moduleKeys) {
  const storeModule = modules(modulePath)
  stores[storeModule.name] = storeModule[storeModule.name]
}

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  plugins: [createPersistedState()],
  modules: { ...stores },
  strict: process.env.NODE_ENV !== 'production',
  state: {
    version: '1.0.0',
    loading: false
  },

  mutations: {
    [mt.LOADING_START](state) {
      state.loading = true
    },
    [mt.LOADING_STOP](state) {
      state.loading = false
    }
  },
  actions: {
    async [at.apiService](
      { commit, rootState },
      {
        uuid = '',
        data = null,
        headers = {},
        params = null,
        method = 'get',
        action = 'get',
        responseType = '',
        serviceName = 'order'
      }
    ) {
      commit(mt.LOADING_START)

      try {
        const result = await $axios({
          data,
          method,
          params,
          headers,
          responseType,
          url: api.url() + api.points[serviceName][action](uuid)
        })

        if (result.status === 200) {
          return result.data
        } else {
          throw result
        }
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.reasons) {
          throw error.response.data.reasons
        } else {
          throw error
        }
      }
    }
  }
}

export default new Vuex.Store<RootState>(store)
