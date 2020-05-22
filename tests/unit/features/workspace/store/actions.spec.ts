import { createServer } from '@/server'
import { Server } from 'miragejs'
import { actions } from '@/features/workspace/store/actions'

import workspaces from '@/server/fixtures/workspaces'
import projects from '@/server/fixtures/projects'

let server: Server

beforeEach(() => {
  server = createServer()
})

afterEach(() => {
  server.shutdown()
})

describe('workspace actions', () => {
  it('can GET /workspace list', async () => {
    const state = {
      workspaceQuery: {
        limit: 10,
        offset: 0
      }
    }
    const commit = jest.fn()
    const getWorkspaces = actions.getWorkspaces as Function

    await getWorkspaces({ state, commit })
    await expect(commit).toHaveBeenCalledWith('SET_LOADING', { name: 'workspacesLoading', value: true })
    await expect(commit).toHaveBeenCalledWith('SET_WORKSPACES', {
      workspaces
    })
  })

  it('can GET /workspace by short_uuid', async () => {
    const workspace = workspaces.find(workspace => workspace.short_uuid === '3Cpy-QMzd-MVko-1rDQ')
    const commit = jest.fn()
    const getWorkspace = actions.getWorkspace as Function

    await getWorkspace({ commit }, '3Cpy-QMzd-MVko-1rDQ')
    expect(commit).toHaveBeenCalledWith('SET_WORKSPACE', workspace)
  })

  it('can GET /workspace projects by short_uuid', async () => {
    const uuid = '695fcc8b-ba8c-4575-a1e0-f0fcfc70a349'
    const state = {
      workspaceProjectsQuery: {
        limit: 10,
        offset: 0
      }
    }
    const projectsList = projects.filter(project => project.workspace === uuid)
    const commit = jest.fn()
    const getWorkpaceProjects = actions.getWorkpaceProjects as Function

    await getWorkpaceProjects({ state, commit }, uuid)

    await expect(commit).toHaveBeenCalledWith('SET_LOADING', { name: 'workspaceProjectsLoading', value: true })
    await expect(commit).toHaveBeenCalledWith('SET_WORKSPACE_PROJECTS', projectsList)
  })

  it('it should change workspace settings', async () => {
    const commit = jest.fn()
    const changeSettings = actions.changeSettings as Function
    const setting = { path: 'menu', value: 'list' }

    await changeSettings({ commit }, setting)

    await expect(commit).toHaveBeenCalledWith('UPDATE_SETTINGS', setting)
  })
})
