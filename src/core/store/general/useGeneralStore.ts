import { useState, useActions } from '@u3u/vue-hooks'
import { GENERAL_STORE, action, stateType } from './types'

export default function () {
  const state = {
    ...useState(GENERAL_STORE, {
      ...stateType
    })
  }

  const actions = {
    ...useActions(GENERAL_STORE, { ...action })
  }

  return {
    ...state,
    ...actions
  }
}
