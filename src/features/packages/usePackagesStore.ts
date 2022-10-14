import * as type from './types'
import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const serviceName = type.PACKAGES_STORE
const api = apiStringify(serviceName)

export const usePackagesStore = defineStore(type.PACKAGES_STORE, {
  state: () => {
    return {
      projectPackages: {
        count: 0,
        next: null,
        results: []
      },
      loadingPackages: true
    }
  },

  actions: {
    async getInitialProjectPackages(params) {
      this.loadingPackages = true

      await this.getProjectPackages(params)

      this.loadingPackages = false
    },

    async getProjectPackages({ params, uuid }) {
      let packages
      try {
        packages = await apiService({
          uuid,
          params,
          serviceName,
          action: api.projectPackages
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on load packages in getProjectPackages action.\nError: ', e)
        return
      }
      const { count, results, next } = packages

      this.projectPackages = {
        next,
        count,
        results: [...this.projectPackages.results, ...results]
      }
    },

    async getTargetPackage(uuid: string) {
      let packageTarget
      try {
        packageTarget = await apiService({
          uuid,
          serviceName,
          action: api.getDownloadLink
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on load packageTarget in getTargetPackage action.\nError: ', e)
        return
      }

      return packageTarget.target || ''
    },

    async downloadPackage(uuid: string) {
      const url = await this.getTargetPackage(uuid)

      let packageSource
      try {
        packageSource = await apiService({
          url,
          responseType: 'blob',
          transformResponse: [data => data]
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on load packageSource in downloadPackage action.\nError: ', e)
        return
      }

      return packageSource
    },

    async resetStore() {
      this.projectPackages = {
        count: 0,
        next: null,
        results: []
      }
    }
  }
})
