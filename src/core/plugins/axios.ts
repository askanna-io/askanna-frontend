import axios from 'axios'
import VueRouter from 'vue-router'
import { useRouter } from '@/core/plugins/vue-hooks'
const { isNavigationFailure, NavigationFailureType } = VueRouter
// create axios instance and set csrftoken for Django
const $axios = axios
$axios.defaults.xsrfCookieName = 'csrftoken'
$axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

// add token to request if exist
$axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Token ${token}`
      config.headers['askanna-agent'] = 'webui'
      config.headers['askanna-agent-version'] = process.env.VERSION
    }

    return config
  },

  function (err) {
    return Promise.reject(err)
  }
)

// for each response check status
$axios.interceptors.response.use(
  config => config,

  err => {
    if (err.response && err.response.status === 401) {
      localStorage.setItem('token', '')
      // trying to redirect user to signin page
      const { route, router } = useRouter()
      // @ts-expect-error
      if (route.value.meta.requiresAuth) {
        router.push({ name: 'signin' }).catch(failure => {
          if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
            return
          }
        })
      }

      return
    }

    return Promise.reject(err)
  }
)

export default $axios
