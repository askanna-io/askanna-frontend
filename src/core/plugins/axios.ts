import axios from 'axios'
import router from '../router'
// create axios instance and set csrftoken for Django
const $axios = axios.create()
$axios.defaults.xsrfCookieName = 'csrftoken'
$axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'

// add token to request if exist
$axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('token')

    if (token != null) {
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
      router.push({ name: 'login' })
    }

    return Promise.reject(err)
  }
)

export default $axios
