import { get } from 'lodash'
import { defineStore } from 'pinia'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'
import usePrettyJSON from '@/core/composition/usePrettyJSON'
import useFileExtension from '@/core/composition/useFileExtension'

const ext = useFileExtension()
const prettyJSON = usePrettyJSON()

const allowedImageExts = ext.images
const noPreviewExts = ext.noPreview

export const useFileStore = defineStore('file', {
  state: () => {
    return {
      loading: true,
      loadingFullData: false,

      currentView: 'raw',

      size: 0,
      fileSource: '',
      fileExtension: '',
      fileBlob: new Blob(),
      rawFile: new Blob() || '',

      isFileBig: true,
      isFileImg: false,
      isFileJSON: true,
      isFileHTML: false,
      isShowFilePreview: false,
      isFileBigForRawView: false
    }
  },
  getters: {
    filePreview: state => (state.isFileJSON ? prettyJSON(state.fileSource, 2) : state.fileSource || state.fileBlob),

    filePreviewByView() {
      return (currentView: string) => {
        if (!this.isFileJSON) return this.fileSource

        return currentView === 'raw' ? this.fileSource : prettyJSON(this.fileSource, 2).prettyJson
      }
    },

    fileSourceForCopy() {
      return (currentView: string) => {
        return currentView === 'raw' ? this.rawFile : this.filePreviewByView(currentView)
      }
    },

    /**
     * Returns is file empty
     *
     * @returns {boolean}
     */

    isFileEmpty() {
      return !this.filePreview && !this.loading
    },

    isValidJSON() {
      return this.filePreview.isValidJSON
    },

    isRenderedExt() {
      return ext.isRendered.includes(this.fileExtension)
    }
  },

  actions: {
    async getFilePreview({
      url,
      size,
      uuid,
      extension,
      serviceName,
      serviceAction
    }: {
      url?: string
      uuid?: string
      extension: string
      serviceName?: string
      size: number | string
      serviceAction?: string
    }) {
      let api,
        action = undefined

      if (url) {
        action = undefined
        serviceName = undefined
      } else {
        api = apiStringify(serviceName)
        action = get(api, serviceAction)
      }

      this.loading = true

      let response = {
        data: { type: '', size: 0 },
        headers: { 'content-type': '', 'content-range': '' }
      }

      let isShowFilePreview = true

      this.fileExtension = extension
      this.isFileJSON = extension === 'json'
      const isFileHTML = extension === 'html'
      const maxLength = ext.bigPreview.includes(extension) ? 5242880 : 10000
      const isFileImg = allowedImageExts.includes(extension)

      let isFileBig = Number(size) >= maxLength
      const isFileBigForRawView = Number(size) >= 10000

      // get images
      if (allowedImageExts.includes(extension)) {
        response = await apiService({
          url,
          uuid,
          action,
          serviceName,
          responseType: 'blob',
          returnFullResponse: true
        })
        isFileBig = false
        isShowFilePreview = true

        this.fileBlob = response.data as Blob
      }

      // skip load for no preview exts files
      else if (noPreviewExts.includes(extension)) {
        this.fileSource = ' '
      }

      // get full file
      else if (!isFileBig) {
        if (this.isFileJSON) {
          response = await apiService({
            url,
            uuid,
            action,
            serviceName,
            responseType: 'text',
            returnFullResponse: true,
            transformResponse: [data => data]
          })
        } else {
          response = await apiService({
            url,
            uuid,
            action,
            serviceName,
            responseType: 'text',
            returnFullResponse: true
          })
        }
        isFileBig = false
        this.fileSource = response.data
      }

      // get preview of file only 10 000 bytes
      else {
        try {
          response = await apiService({
            url,
            uuid,
            action,
            serviceName,
            responseType: 'text',
            headers: {
              range: 'bytes=0-10000'
            },
            returnFullResponse: true,
            transformResponse: [data => data]
          })

          this.fileSource = response.data
        } catch (e) {
          this.loading = false

          return
        }
      }

      if (noPreviewExts.includes(extension)) {
        isShowFilePreview = false
      }

      this.size = +size
      this.isFileImg = isFileImg
      this.isFileBig = isFileBig
      this.isFileHTML = isFileHTML

      this.isShowFilePreview = isShowFilePreview
      this.isFileBigForRawView = isFileBigForRawView

      this.loading = false
    },

    async getFullFile({
      url,
      uuid,
      serviceName,
      serviceAction
    }: {
      url?: string
      uuid?: string
      serviceName?: string
      serviceAction?: string
    }) {
      let api,
        action = undefined

      this.loadingFullData = true

      if (url) {
        serviceName = undefined
        action = undefined
      } else {
        api = apiStringify(serviceName)
        action = get(api, serviceAction)
      }
      const responseType = this.isFileImg ? 'blob' : this.isFileJSON ? 'text' : 'blob'

      try {
        const result = await apiService({
          url,
          uuid,
          action,
          serviceName,
          responseType,
          transformResponse: [data => data]
        })
        this.rawFile = result
        this.loadingFullData = false

        return result
      } catch (e) {}

      this.loadingFullData = false
    }
  }
})
