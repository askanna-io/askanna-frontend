import { computed } from '@vue/composition-api'
import { useState, useActions } from '@u3u/vue-hooks'
import { showSnackBar, closeSnackBar } from '@/core/store/actionTypes'

export default function() {
  const state = {
    ...useState('global', { snackbar: 'snackbar', open: 'snackbar.open' })
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
    ...useActions('global', [showSnackBar, closeSnackBar])
  }

  return {
    openVmodel,
    ...state,
    ...actions
  }
}
