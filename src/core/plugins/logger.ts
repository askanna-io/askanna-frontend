import _Vue from 'vue'
import store from '../store'

const LOGGER = {
  consoleLog: process.env.NODE_ENV !== 'production',
  snackBar: process.env.NODE_ENV !== 'production',
  development: true,
  production: false
}

const globalStore = 'global'
const setSnackBar = `${globalStore}/${'SET_SNACKBAR'}`

export const loggerFunctions = {
  success(...message: any) {
    const timeout = 2000
    store.commit(setSnackBar, {
      message,
      timeout
    })
  },
  authError() {
    store.commit(setSnackBar, {
      message: 'wrong_credentials',
      color: 'deep-orange'
    })
  },
  passResetSuccess() {
    store.commit(setSnackBar, {
      message: 'check_your_email',
      color: 'light-green'
    })
  },
  userWarning(message: any) {
    store.commit(setSnackBar, { message, color: 'orange' })
  },
  error(message: any, error: any) {
    let timeout

    if (LOGGER.snackBar) {
      store.commit(setSnackBar, { message, timeout, color: 'deep-orange' })
    }

    if (LOGGER.consoleLog) {
      // eslint-disable-next-line no-console
      console.log(message, error)
    }
  }
}

export function logger(Vue: typeof _Vue, options?: any): void {
  Vue.prototype.logger = loggerFunctions
}

export default logger
