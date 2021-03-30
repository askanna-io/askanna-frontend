import $axios from '@/core/plugins/axios'
import { api, apiUrlFunctionParams } from './api-settings'
import { Method, ResponseType, AxiosResponse, AxiosTransformer } from 'axios'

interface ServiceParams {
  uuid?: any
  data?: any
  headers?: any
  params?: any
  method?: Method
  action?: string
  responseType?: ResponseType
  serviceName?: string
  transformResponse?: AxiosTransformer | AxiosTransformer[]
}

const apiService = async ({
  uuid = '',
  data = null,
  headers = {},
  params = null,
  method = 'get',
  action = 'get',
  responseType = 'json',
  transformResponse,
  serviceName = 'workspace'
}: ServiceParams) => {
  try {
    const result = await $axios(api.apiUrl() + api.points[serviceName][action](uuid), {
      data,
      method,
      params,
      headers,
      responseType,
      transformResponse
    })

    if (result.status === 200 || result.status === 201 || result.status === 204) {
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
