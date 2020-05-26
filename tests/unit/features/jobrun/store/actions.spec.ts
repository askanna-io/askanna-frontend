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

  it('could close result modal', async () => {
    const commit = jest.fn()
    const closeResultModal = actions.closeResultModal as Function

    await closeResultModal({ commit })
    await expect(commit).toHaveBeenCalledWith('CLOSE_RESULT_MODAL')
  })

  it('can GET /jobrun by short_uuid', async () => {
    const uuid = '7Mbq-MLk3-BaV3-Pvye'

    const commit = jest.fn()
    const getJobRun = actions.getJobRun as Function
    const jobRun = jobruns.find(jobrun => jobrun.short_uuid === uuid)

    await getJobRun({ commit }, uuid)
    await expect(commit).toHaveBeenCalledWith('SET_JOB_RUN', jobRun)
  })

  it('can GET /jobrun payload by short_uuid', async () => {
    const uuid = '7Mbq-MLk3-BaV3-Pvye'

    const commit = jest.fn()
    const getJobRunPayload = actions.getJobRunPayload as Function
    const jobRun = jobruns.find(jobrun => jobrun.short_uuid === uuid) || { payload: { uuid: '' } }

    const payload = { duration: 3 }

    await getJobRunPayload({ commit }, { jobRunShortId: uuid, payloadUuid: jobRun.payload.uuid })

    await expect(commit).toHaveBeenCalledWith('SET_LOADING', { name: 'payLoadLoading', value: true })
    await expect(commit).toHaveBeenCalledWith('SET_JOB_RUN_PAYLOAD', payload)
    await expect(commit).toHaveBeenCalledWith('SET_LOADING', { name: 'payLoadLoading', value: false })
  })
})
