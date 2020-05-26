import { Server } from 'miragejs'
import { createServer } from '@/server'
import jobs from '@/server/fixtures/jobs'
import { actions } from '@/features/jobs/store/actions'

let server: Server

beforeEach(() => {
  server = createServer()
})

afterEach(() => {
  server.shutdown()
})

describe('jobs actions', () => {
  it('can GET /jobs list', async () => {
    const commit = jest.fn()
    const getJobsList = actions.getJobsList as Function

    await getJobsList({ commit })
    await expect(commit).toHaveBeenCalledWith('SET_JOBS_LIST', {
      jobs
    })
  })
})
