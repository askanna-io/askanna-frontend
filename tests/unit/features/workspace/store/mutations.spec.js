import { mutations } from '@/features/workspace/store/mutations'
import { mutation } from '@/features/workspace/store/types'
import * as data from './data'

describe('workspace muttions', () => {
  it('SET_WORKSPACE should update state with data in payload', () => {
    const state = {
      workspace: {}
    }
    mutations[mutation.SET_WORKSPACE](state, data.workspace)
    expect(state.workspace).toBe(data.workspace)
  })

  it('SET_WORKSPACES should update state with data in payload', () => {
    const state = {
      workspaces: {}
    }

    mutations[mutation.SET_WORKSPACES](state, data.workspaces)
    expect(state.workspaces).toBe(data.workspaces)
  })

  it('SET_WORKSPACE_PROJECTS should update state with data in payload', () => {
    const state = {
      workspaceProjects: {}
    }
    mutations[mutation.SET_WORKSPACE_PROJECTS](state, data.projects)
    expect(state.workspaceProjects).toBe(data.projects)
  })

  it('SET_LOADING should update state with data in payload', () => {
    const state = {
      workspacesLoading: false
    }

    mutations[mutation.SET_LOADING](state, { name: 'workspacesLoading', value: true })
    expect(state.workspacesLoading).toBe(true)
  })

  it('UPDATE_SETTINGS should update state with data in payload', () => {
    const state = {
      workspaceSettings: {
        projectView: 0
      }
    }

    mutations[mutation.UPDATE_SETTINGS](state, { projectView: 1 })
    expect(state.workspaceSettings).toStrictEqual({ projectView: 1 })
  })
})
