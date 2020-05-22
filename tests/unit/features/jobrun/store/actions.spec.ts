import { Server } from 'miragejs'
import { createServer } from '@/server'
import jobruns from '@/server/fixtures/jobruns'
import { actions } from '@/features/jobrun/store/actions'

let server: Server

beforeEach(() => {
  server = createServer()
})

afterEach(() => {
  server.shutdown()
})

describe('jobrun actions', () => {
  it('can GET /jobruns by short_uuid', async () => {
    const uuid = '2mb4-iA7p-680u-Tpaw'

    const commit = jest.fn()
    const getRunsJob = actions.getRunsJob as Function

    await getRunsJob({ commit }, uuid)
    await expect(commit).toHaveBeenCalledWith('SET_JOB_RUNS', { jobruns })
  })

  it('can reset jobrun store', async () => {
    const commit = jest.fn()
    const resetStore = actions.resetStore as Function

    await resetStore({ commit })
    await expect(commit).toHaveBeenCalledWith('UPDATE_JOB_RUN_STORE')
  })

  it('can show result jobrun store', async () => {
    const commit = jest.fn()
    const showJobRunResult = actions.showJobRunResult as Function

    await showJobRunResult({ commit })
    await expect(commit).toHaveBeenCalledWith('SET_RESULT_MODAL')
  })
})
