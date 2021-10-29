import { USER_STORE, action, mutation, getter } from '../store/types'
import { useState, useActions, useGetters, useMutations } from '@u3u/vue-hooks'

export default function () {
  const state = {
    ...useState(USER_STORE, {
      tempAuth: 'tempAuth',
      userProfile: 'userProfile',
      globalProfile: 'globalProfile'
    })
  }

  const actions = {
    ...useActions(USER_STORE, { ...action })
  }

  const getters = {
    ...useGetters(USER_STORE, { ...getter })
  }

  const mutations = {
    ...useMutations(USER_STORE, { ...mutation })
  }

  return {
    state,
    actions,
    getters,
    mutations
  }
}
