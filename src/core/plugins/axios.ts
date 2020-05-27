import axios, { AxiosRequestConfig } from 'axios'
import router from '../router'
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
      router.push({ name: 'login' })

      return
    }

    return Promise.reject(err)
  }
)

export default $axios
