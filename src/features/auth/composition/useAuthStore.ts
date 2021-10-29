import { useState, useActions, useGetters } from '@u3u/vue-hooks'
import { authStoreName, ac, gt } from '../store/types'

export default function () {
  const state = {
    ...useState(authStoreName, {
      authToken: 'authToken'
    })
  }

  const actions = {
    ...useActions(authStoreName, { ...ac })
  }

  const getters = {
    ...useGetters(authStoreName, { ...gt })
  }

  return {
    ...state,
    state,
    actions,
    getters
  }
}
