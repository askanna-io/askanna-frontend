import { useState, useActions } from '@u3u/vue-hooks'
import { authStoreName, ac } from '../store/types'

export default function () {
  const state = {
    ...useState(authStoreName, {
      authToken: 'authToken'
    })
  }

  const actions = {
    ...useActions(authStoreName, { ...ac })
  }

  return {
    ...state,
    actions,
    state
  }
}
