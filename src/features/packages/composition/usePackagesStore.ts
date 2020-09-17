import { useState, useActions } from '@u3u/vue-hooks'
import { PACKAGES_STORE, action, stateType } from '../store/types'

export default function () {
  const state = {
    ...useState(PACKAGES_STORE, {
      ...stateType
    })
  }

  const actions = {
    ...useActions(PACKAGES_STORE, { ...action })
  }

  return {
    open,
    ...state,
    ...actions
  }
}
