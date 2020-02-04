type apiPoint<T> = { [key: string]: T }
type apiUrl = (uuid: string) => string
type AuthApiUrl = () => string

interface ApiSettings {
  url: () => string
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

const apiUrl = 'localhost'
const apiPort = 8005
export const api: ApiSettings = {
  url: () => `http://${apiUrl}:${apiPort}/`,
  // auth api
  auth: {
    login: () => `rest-auth/login/`,
    logout: () => `oauth2/logout`
  },
  points: {
    auth: {
      logout: () => `oauth2/logout`
    }
  }
}

export const apiStringify = (moduleName: string) => {
  return Object.keys(api.points[moduleName]).reduce((acc: any, prop) => {
    acc[prop] = prop

    return acc
  }, {})
}
