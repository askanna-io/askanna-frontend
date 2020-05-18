import _Vue from 'vue'
import store from '@/core/store'

const LOGGER = {
  consoleLog: true,
  snackBar: true, //process.env.NODE_ENV !== 'production',
  development: true,
  production: false
}

const snackbarStore = 'snackbar'
const setSnackBar = `${snackbarStore}/${'SET_SNACKBAR'}`

export const logger = {
  success: (message: any) => {
    const timeout = 2000
    store.commit(setSnackBar, {
      message,
      timeout,
      color: 'light-green'
    })
  },
  authError: () => {
    store.commit(setSnackBar, {
      message: 'wrong_credentials',
      color: 'deep-orange'
    })
  },
  passResetSuccess: () => {
    store.commit(setSnackBar, {
      message: 'check_your_email',
      color: 'light-green'
    })
  },
  userWarning: (message: any) => {
    store.commit(setSnackBar, { message, color: 'orange' })
  },
  userDanger: (message: any) => {
    store.commit(setSnackBar, { message, color: 'amber darken-4' })
  },
  error: (errorHint: string, error: Error) => {
    let message, timeout
    if (LOGGER.snackBar) {
      message = `${errorHint}\n ${error.message}`

      store.commit(setSnackBar, {
        message,
        timeout,
        color: 'amber darken-4'
      })
    }

    if (LOGGER.consoleLog) {
      // eslint-disable-next-line no-console
      console.log(errorHint, error)
    }
  }
}

export default function Logger(Vue: typeof _Vue, options?: any): void {
  Vue.prototype.logger = logger
}
