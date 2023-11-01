import { api } from './api-settings'
import $axios from '@/plugins/axios'
import { Method, ResponseType, AxiosTransformer } from 'axios'

const SUCCESS_CODES = [200, 201, 202, 204, 206]

interface ServiceParams {
  data?: any
  suuid?: any
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
  suuid = '',
  headers = {},
  method = 'get',
  action = 'get',
  data = undefined,
  params = undefined,
  transformResponse,
  responseType = 'json',
  serviceName = 'workspace',
  returnFullResponse = false
}: ServiceParams) => {
  try {
    const apiUrl = url ? undefined : api.apiUrl() + api.points[serviceName][action](suuid)
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

    if (SUCCESS_CODES.includes(result?.status)) {
      if (returnFullResponse) {
        return result
      }

      return result.data
    } else {
      throw result
    }
  } catch (error) {
    if (error?.response && error?.response.status === 400 && error?.response.data.reasons) {
      throw error?.response.data.reasons
    } else {
      throw error
    }
  }
}

export default apiService
