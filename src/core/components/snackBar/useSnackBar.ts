import { computed } from '@vue/composition-api'
import { useState, useActions } from '@u3u/vue-hooks'
import { ac, snackbarStoreName } from './store/types'

const { showSnackBar, closeSnackBar } = ac

export default function () {
  const state = {
    ...useState(snackbarStoreName, { snackbar: 'snackbar', open: 'snackbar.open' })
  }

  const openVmodel = computed({
    get: () => {
      return state.snackbar.value.open
    },
    set: () => {
      actions.closeSnackBar()
    }
  })

  const actions = {
    ...useActions(snackbarStoreName, [showSnackBar, closeSnackBar])
  }

  return {
    openVmodel,
    ...state,
    ...actions
  }
}
