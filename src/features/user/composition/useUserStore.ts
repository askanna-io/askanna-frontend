import { useState, useActions, useMutations } from '@u3u/vue-hooks'
import { USER_STORE, action, mutation } from '../store/types'

export default function () {
  const state = {
    ...useState(USER_STORE, {
      tempAuth: 'tempAuth',
      userProfile: 'userProfile'
    })
  }

  const actions = {
    ...useActions(USER_STORE, { ...action })
  }

  const mutations = {
    ...useMutations(USER_STORE, { ...mutation })
  }

  return {
    state,
    actions,
    mutations
  }
}
