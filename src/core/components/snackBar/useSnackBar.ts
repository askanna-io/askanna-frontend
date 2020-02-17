import { computed } from '@vue/composition-api'
import { useState, useActions } from '@u3u/vue-hooks'
import { showSnackBar, closeSnackBar } from '@/core/store/actionTypes'

export default function() {
  const state = {
    ...useState('global', { snackbar: 'snackbar', open: 'snackbar.open' })
  }

  const open = computed({
    get: () => state.open.value,
    set: () => {
      closeSnackBar
    }
  })

  const actions = {
    ...useActions('global', [showSnackBar, closeSnackBar])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
