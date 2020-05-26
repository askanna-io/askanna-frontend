import _Vue from 'vue'
import { Commit } from 'vuex'

const LOGGER = {
  consoleLog: true,
  snackBar: true, //process.env.NODE_ENV !== 'production',
  development: true,
  production: false
}

const snackbarStore = 'snackbar'
const setSnackBar = `${snackbarStore}/${'SET_SNACKBAR'}`

export const logger = {
  success: (commit: Commit, message: any) => {
    const timeout = 2000
    commit(setSnackBar, {
      message,
      timeout,
      color: 'light-green'
    })
  },
  authError: (commit: Commit) => {
    commit(setSnackBar, {
      message: 'wrong_credentials',
      color: 'deep-orange'
    })
  },
  passResetSuccess: (commit: Commit) => {
    commit(setSnackBar, {
      message: 'check_your_email',
      color: 'light-green'
    })
  },
  userWarning: (commit: Commit, message: any) => {
    commit(setSnackBar, { message, color: 'orange' })
  },
  userDanger: (commit: Commit, message: any) => {
    commit(setSnackBar, { message, color: 'amber darken-4' })
  },
  error: (commit: Commit, errorHint: string, error: Error) => {
    let message, timeout
    if (LOGGER.snackBar) {
      message = `${errorHint}\n ${error.message}`

      commit(setSnackBar, {
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
