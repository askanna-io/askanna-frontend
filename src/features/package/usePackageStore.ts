import { defineStore } from 'pinia'
import { File, Package } from './types'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const serviceName = 'package'
const api = apiStringify(serviceName)

export const usePackageStore = defineStore('package', {
  state: () => {
    return {
      loading: true,
      processingList: [],
      packageData: {
        size: 0,
        created: '',
        filename: '',
        project: '',
        suuid: '',
        created_by: 0,
        created_at: '',
        cdn_base_url: '',
        files: [] as File[],
        storage_location: ''
      } as Package
    }
  },

  actions: {
    async getPackage({ loading, failedRoute, ...suuid }) {
      if (loading) this.loading = true

      let packageData
      try {
        packageData = await apiService({
          serviceName,
          action: api.get,
          suuid: suuid.packageId
        })
      } catch (e) {
        if (e.response && e.response.status === 500) {
          const found = this.processingList.find(item => item.packageId === suuid.packageId)

          if (!found) {
            this.processingList.push(suuid)
          }
          this.setPackage({
            packageData: {
              files: []
            }
          })
          if (loading) this.loading = false

          return
        }

        const logger = useLogger()

        const name = failedRoute || 'workspace-project-code-does-not-exist'

        this.$routerAskAnna.routerPush({ name })

        if (loading) this.loading = false

        logger.error('Error on load packageData in getPackage action.\nError: ', e)

        return
      }

      this.processingList = this.processingList.filter(item => item.packageId !== suuid.packageId)
      this.setPackage({ packageData })
      this.loading = false
    },

    async registerPackage(data) {
      let packageData
      try {
        packageData = await apiService({
          data,
          serviceName,
          method: 'post',
          action: api.registerPackage
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on upload package in registerPackage action.\nError: ', e)

        return
      }
      return packageData
    },

    async registerChunkPackage({ suuid, data }) {
      let result
      try {
        result = await apiService({
          data,
          suuid,
          serviceName,
          method: 'post',
          action: api.registerChunkPackage
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on finish register chunck package in registerChunkPackage action.\nError: ', e)
      }

      return result
    },

    async finishUpload({ suuid, data }) {
      let result
      // convert the data to formdata for proper file upload
      const formData = new FormData()

      type CalType = (name: any, value: any) => void
      const callback: CalType = ([name, value]) => formData.append(name, value)

      Object.entries(data).forEach(callback)

      try {
        result = await apiService({
          suuid,
          serviceName,
          method: 'post',
          data: formData,
          action: api.finishUpload
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on finish upload package in finishUpload action.\nError: ', e)

        return
      }
      return result
    },

    setPackage({ packageData: data }) {
      const re = /(?:\.([^.]+))?$/
      const files = data.files.map((file: File) => {
        const fileExt = re.exec(file.name)
        const ext = (file.type === 'file' && fileExt && typeof fileExt[1] !== 'undefined' && fileExt[1]) || 'txt'

        return { ...file, ext }
      })

      this.packageData = { ...data, files }
    }
  }
})
