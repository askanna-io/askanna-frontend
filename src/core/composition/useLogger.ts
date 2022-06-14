import { useSnackBar } from '@/core/components/snackBar/useSnackBar'

const LOGGER = {
  snackBar: false,
  consoleLog: true
}

export const useLogger = () => {
  const snackBar = useSnackBar()

  return {
    success: (message: string) => {
      const timeout = 2000
      snackBar.showSnackBar({
        message,
        timeout,
        color: 'success'
      })
    },
    authError: () => {
      snackBar.showSnackBar({
        color: 'failed',
        message: 'wrong_credentials'
      })
    },
    passResetSuccess: () => {
      snackBar.showSnackBar({
        message: 'check_your_email',
        color: 'success'
      })
    },
    userWarning: (message: string) => {
      snackBar.showSnackBar({ message, color: 'orange' })
    },
    userDanger: (message: string) => {
      snackBar.showSnackBar({ timeout: 2000, message, color: 'failed' })
    },
    error: (errorHint: string, error: Error) => {
      let message, timeout
      if (LOGGER.snackBar) {
        message = `${errorHint}\n ${error.message}`

        snackBar.showSnackBar({
          message,
          timeout,
          color: 'failed'
        })
      }

      if (LOGGER.consoleLog) {
        // eslint-disable-next-line no-console
        console.log(errorHint, error)
      }
    }
  }
}
