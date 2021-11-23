import { useState, useGetters, useActions, useMutations } from '@u3u/vue-hooks'
import { WORKSPACE_STORE, action, getter, mutation, stateType } from '../store/types'

export default function () {
  const state = useState(WORKSPACE_STORE, {
    ...stateType,
    loading: 'loading',
    workspace: 'workspace',
    workspaces: 'workspaces',
    currentPeople: 'currentPeople',
    sharedWorkspaces: 'sharedWorkspaces',
    workspaceProjects: 'workspaceProjects',
    workspaceSettings: 'workspaceSettings',
    workspaceProjectsLoading: 'workspaceProjectsLoading'
  })

  const actions = {
    ...useActions(WORKSPACE_STORE, { ...action })
  }

  const getters = {
    ...useGetters(WORKSPACE_STORE, { ...getter })
  }

  const mutations = {
    ...useMutations(WORKSPACE_STORE, { ...mutation })
  }

  return {
    ...state,
    state,
    ...actions,
    actions,
    getters,
    mutations
  }
}
