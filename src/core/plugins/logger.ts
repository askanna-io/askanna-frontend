import _Vue from 'vue'
import { Commit } from 'vuex'

const LOGGER = {
  consoleLog: true,
  snackBar: false, //process.env.NODE_ENV !== 'production',
  development: true,
  production: false
}

const snackbarStore = 'snackbar'
const setSnackBar = `${snackbarStore}/${'SET_SNACKBAR'}`

export const logger = {
  success: (commit: Commit, message: any) => {
    const timeout = 2000
    commit(
      setSnackBar,
      {
        message,
        timeout,
        color: 'success'
      },
      { root: true }
    )
  },
  authError: (commit: Commit) => {
    commit(
      setSnackBar,
      {
        message: 'wrong_credentials',
        color: 'failed'
      },
      { root: true }
    )
  },
  passResetSuccess: (commit: Commit) => {
    commit(
      setSnackBar,
      {
        message: 'check_your_email',
        color: 'success'
      },
      { root: true }
    )
  },
  userWarning: (commit: Commit, message: any) => {
    commit(setSnackBar, { message, color: 'orange' }, { root: true })
  },
  userDanger: (commit: Commit, message: any) => {
    commit(setSnackBar, { timeout: 2000, message, color: 'failed' }, { root: true })
  },
  error: (commit: Commit, errorHint: string, error: Error) => {
    let message, timeout
    if (LOGGER.snackBar) {
      message = `${errorHint}\n ${error.message}`

      commit(
        setSnackBar,
        {
          message,
          timeout,
          color: 'failed'
        },
        { root: true }
      )
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
