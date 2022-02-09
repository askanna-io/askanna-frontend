import $axios from '@/core/plugins/axios'
import { api } from './api-settings'
import { Method, ResponseType, AxiosTransformer } from 'axios'

interface ServiceParams {
  data?: any
  uuid?: any
  url?: string
  params?: any
  headers?: any
  method?: Method
  action?: string
  serviceName?: string
  responseType?: ResponseType
  returnFullResponse?: boolean
  transformResponse?: AxiosTransformer | AxiosTransformer[]
}

const apiService = async ({
  url = '',
  uuid = '',
  data = null,
  headers = {},
  params = null,
  method = 'get',
  action = 'get',
  transformResponse,
  responseType = 'json',
  serviceName = 'workspace',
  returnFullResponse = false
}: ServiceParams) => {
  try {
    const apiUrl = url ? undefined : api.apiUrl() + api.points[serviceName][action](uuid)
    let result = null

    if (url) {
      result = await $axios({
        url,
        method,
        headers,
        responseType,
        transformResponse
      })
    } else {
      result = await $axios(apiUrl, {
        url,
        data,
        method,
        params,
        headers,
        responseType,
        transformResponse
      })
    }

    if (result.status === 200 || result.status === 201 || result.status === 204 || result.status === 206) {
      if (returnFullResponse) {
        return result
      }
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

export default apiService
