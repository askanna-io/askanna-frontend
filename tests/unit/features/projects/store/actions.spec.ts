import { createServer } from '@/server'
import { Server } from 'miragejs'
import { actions } from '@/features/project/store/actions'

import jobs from '@/server/fixtures/jobs'
import projects from '@/server/fixtures/projects'

let server: Server

beforeEach(() => {
  server = createServer()
})

afterEach(() => {
  server.shutdown()
})

describe('projects actions', () => {
  it('can GET /project list', async () => {
    const state = {
      query: {
        limit: 10,
        offset: 0
      }
    }
    const commit = jest.fn()
    const getProjects = actions.getProjects as Function

    await getProjects({ state, commit })

    await expect(commit).toHaveBeenCalledWith('SET_PROJECTS', {
      projects
    })
  })

  it('can GET /project by short_uuid', async () => {
    const uuid = '7MQT-6309-9g3t-R5QR'
    const project = projects.find(project => project.short_uuid === uuid)
    const commit = jest.fn()
    const getProject = actions.getProject as Function

    await getProject({ commit }, uuid)
    expect(commit).toHaveBeenCalledWith('SET_PROJECT', project)
  })

  it('can GET /project/jobs by short_uuid', async () => {
    const uuid = '7MQT-6309-9g3t-R5QR'
    const state = {
      query: {
        limit: 10,
        offset: 0
      }
    }
    const commit = jest.fn()
    const getProjectJobs = actions.getProjectJobs as Function

    await getProjectJobs({ state, commit }, uuid)

    await expect(commit).toHaveBeenCalledWith('SET_PROJECT_JOBS', { jobs })
  })

  it('it should reset project job list', async () => {
    const commit = jest.fn()
    const resetProjectJobs = actions.resetProjectJobs as Function

    await resetProjectJobs({ commit })
    await expect(commit).toHaveBeenCalledWith('RESET_PORJECT_JOBS')
  })
})
