import { ActionTree } from 'vuex'
import { loggerState, action } from './types'

const setSnackBar = `snackbar/SET_SNACKBAR`

export const actions: ActionTree<loggerState, RootState> = {
  async [action.error]({ state, commit }, { errorHint, error }) {
    let message, timeout
    if (state.snackBar) {
      message = `${errorHint}\n ${error.message}`

      commit(setSnackBar, {
        message,
        timeout,
        color: 'amber darken-4'
      })
    }

    if (state.consoleLog) {
      // eslint-disable-next-line no-console
      console.log(errorHint, error)
    }
  }
}
