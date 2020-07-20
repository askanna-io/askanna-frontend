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

  const totalProcess = computed(() => {
    const reducer = (acc: number, cr: any) => {
      if (cr.isComplete) return acc
      acc = acc + 1

      return acc
    }

    const count = state.uploads.value.reduce(reducer, 0)

    return count || 0
  })

  const colorStatus = computed(() => (openVmodel.value ? 'white' : 'grey'))

  const iconStatus = computed(() => {
    const reducer = (acc: number, cr: any) => {
      if (cr.isComplete) return acc
      acc = acc + cr.progress

      return acc
    }
    const allProgress = state.uploads.value.reduce(reducer, 0)
    if (allProgress === 0) return 'mdi-circle-slice-8'

    const calcProgress = (allProgress * 100) / (Number(totalProcess.value) * 100) / Number(totalProcess.value)

    switch (true) {
      case calcProgress <= 12.5:
        return 'mdi-circle-slice-1'

      case calcProgress <= 25:
        return 'mdi-circle-slice-2'

      case calcProgress <= 37.5:
        return 'mdi-circle-slice-3'

      case calcProgress <= 50:
        return 'mdi-circle-slice-4'

      case calcProgress <= 62.5:
        return 'mdi-circle-slice-5'

      case calcProgress <= 75:
        return 'mdi-circle-slice-6'

      case calcProgress <= 87.5:
        return 'mdi-circle-slice-7'

      case calcProgress <= 100:
        return 'mdi-circle-slice-8'

      default:
        return 'mdi-timelapse'
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
    colorStatus,
    iconStatus,
    ...state,
    ...actions
  }
}
