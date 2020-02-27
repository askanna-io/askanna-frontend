import { useState, useActions } from '@u3u/vue-hooks'
import { PROJECT_STORE, action } from '../store/types'

export default function() {
  const state = {
    ...useState(PROJECT_STORE, { project: 'project' })
  }

  const actions = {
    ...useActions(PROJECT_STORE, { ...action })
  }

  return {
    open,
    ...state,
    ...actions
  }
}