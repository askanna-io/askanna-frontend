import Vue from 'vue'
import * as at from './actionTypes'
import { api } from '../services/api-settings'
import $axios from '@/core/plugins/axios'
import Vuex, { StoreOptions } from 'vuex'
import { logger } from './logger'
import createPersistedState from 'vuex-persistedstate'

// find all store modules from features and core folders
const stores: any = {}
const persistedStores = []
const featureModules = require.context('@/features', true, /store\/index$/)
const moduleKeys = featureModules.keys()

for (const modulePath of moduleKeys) {
  const storeModule = featureModules(modulePath)

  stores[storeModule.name] = storeModule[storeModule.name]
  persistedStores.push(storeModule.name)
}

const coreModules = require.context('@/core/components', true, /store\/index$/)
const coreModuleKeys = coreModules.keys()

for (const modulePath of coreModuleKeys) {
  const storeModule = coreModules(modulePath)
  stores[storeModule.name] = storeModule[storeModule.name]
  persistedStores.push(storeModule.name)
}

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  plugins: [createPersistedState({ paths: persistedStores.filter(store => store === 'auth') })],
  modules: { ...stores, logger },
  strict: process.env.NODE_ENV !== 'production',
  state: {
    version: '1.0.0',
    loading: false
  },

  mutations: {},
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
        serviceName = 'workspace'
      }
    ) {
      try {
        const result = await $axios({
          data,
          method,
          params,
          headers,
          responseType,
          url: api.apiUrl() + api.points[serviceName][action](uuid)
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
    },

    async [at.apiDownloadSerice](
      { commit, rootState },
      { url, data = null, headers = {}, params = null, method = 'get', responseType = 'blob' }
    ) {
      try {
        const result = await $axios({
          data,
          method,
          params,
          headers,
          responseType,
          url
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
