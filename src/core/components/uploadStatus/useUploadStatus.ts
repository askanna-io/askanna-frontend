import { computed } from '@vue/composition-api'
import { useState, useActions } from '@u3u/vue-hooks'
import { ac, snackbarStoreName } from './store/types'

const { showSnackBar, closeSnackBar, setUpload, addUpload, showHideSnackBar, clearSnackBar } = ac

export default function () {
  const state = {
    ...useState(snackbarStoreName, { snackbar: 'snackbar', open: 'snackbar.open', uploads: 'uploads' })
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
    ...useActions(snackbarStoreName, [
      showSnackBar,
      closeSnackBar,
      setUpload,
      addUpload,
      showHideSnackBar,
      clearSnackBar
    ])
  }

  return {
    openVmodel,
    ...state,
    ...actions
  }
}
