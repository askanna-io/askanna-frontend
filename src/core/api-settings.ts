type apiPoint<T> = { [key: string]: T }
type apiUrl = (uuid: number) => string
type AuthApiUrl = () => string

interface ApiSettings {
  url: () => string
  apiUrl: () => string
  auth: {
    login: AuthApiUrl
    logout: apiUrl
  }
  points: {
    [pointServiceName: string]: apiPoint<apiUrl>
  }
}
interface FuaturesApi {
  [featureApi: string]: (uuid: string) => void | string
}

const apiUrl = process.env.VUE_APP_API_URL
const apiPort = process.env.VUE_APP_API_PORT

export const api: ApiSettings = {
  url: () => `${apiUrl}:${apiPort}/`,
  apiUrl: () => `${apiUrl}:${apiPort}/api/v1/`,
  // auth api
  auth: {
    login: () => `rest-auth/login/`,
    logout: () => `rest-auth/logout/`
  },
  points: {
    auth: {
      logout: () => `rest-auth/logout/`
    },
    jobs: {
      list: () => `job/`
    },
    project: {
      list: () => `project/`
    },
    job: {
      add: () => 'job/',
      get: id => `job/${id}/`,
      update: id => `job/${id}/`,
      remove: id => `job/${id}/`,
      info: id => `job/${id}/info/`,
      kill: id => `job/${id}/kill/`,
      pause: id => `job/${id}/pause/`,
      reset: id => `job/${id}/reset/`,
      start: id => `job/${id}/start/`,
      stop: id => `job/${id}/stop/`,
      result: id => `job/${id}/result/`
    }
  }
}

export const apiStringify = (moduleName: string) => {
  return Object.keys(api.points[moduleName]).reduce((acc: any, prop) => {
    acc[prop] = prop

    return acc
  }, {})
}
