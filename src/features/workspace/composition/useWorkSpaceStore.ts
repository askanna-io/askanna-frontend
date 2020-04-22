import { useState, useActions } from '@u3u/vue-hooks'
import { WORKSPACE_STORE, action, stateType } from '../store/types'

export default function() {
  const state = {
    ...useState(WORKSPACE_STORE, {
      ...stateType,
      workspace: 'workspace',
      workspaces: 'workspaces',
      workspaceProjects: 'workspaceProjects',
      workspaceSettings: 'workspaceSettings'
    })
  }

  const actions = {
    ...useActions(WORKSPACE_STORE, { ...action })
  }

  return {
    ...state,
    ...actions
  }
}