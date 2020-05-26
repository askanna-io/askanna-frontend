import { Server } from 'miragejs'
import { createServer } from '@/server'
import jobs from '@/server/fixtures/jobs'
import { actions } from '@/features/job/store/actions'

let server: Server

beforeEach(() => {
  server = createServer()
})

afterEach(() => {
  server.shutdown()
})

describe('job actions', () => {
  it('can GET /job by short_uuid', async () => {
    const uuid = '2mb4-iA7p-680u-Tpaw'
    const job = jobs.find(job => job.short_uuid === uuid)
    const commit = jest.fn()
    const getJob = actions.getJob as Function

    await getJob({ commit }, uuid)
    await expect(commit).toHaveBeenCalledWith('SET_JOB', job)
  })

  it('can POST /job start by short_uuid', async () => {
    const uuid = '2mb4-iA7p-680u-Tpaw'
    const job = jobs.find(job => job.short_uuid === uuid)
    const commit = jest.fn()
    const startJob = actions.startJob as Function

    await startJob({ commit }, uuid)
    await expect(commit).toHaveBeenCalledWith('snackbar/SET_SNACKBAR', {
      message: 'Job was started',
      timeout: 2000,
      color: 'light-green'
    })

    await expect(commit).toHaveBeenCalledWith('UPDATE_JOB', job)
  })

  it('can POST /job stop by short_uuid', async () => {
    const uuid = '2mb4-iA7p-680u-Tpaw'
    const job = jobs.find(job => job.short_uuid === uuid)
    const commit = jest.fn()
    const stopJob = actions.stopJob as Function

    await stopJob({ commit }, uuid)
    await expect(commit).toHaveBeenCalledWith('snackbar/SET_SNACKBAR', {
      color: 'amber darken-4',
      message: 'Job was stoped'
    })

    await expect(commit).toHaveBeenCalledWith('UPDATE_JOB', job)
  })

  it('can POST /job pause by short_uuid', async () => {
    const uuid = '2mb4-iA7p-680u-Tpaw'
    const job = jobs.find(job => job.short_uuid === uuid)
    const commit = jest.fn()
    const pauseJob = actions.pauseJob as Function

    await pauseJob({ commit }, uuid)

    await expect(commit).toHaveBeenCalledWith('UPDATE_JOB', job)
  })

  it('can POST /job reset by short_uuid', async () => {
    const uuid = '2mb4-iA7p-680u-Tpaw'
    const job = jobs.find(job => job.short_uuid === uuid)
    const commit = jest.fn()
    const resetJob = actions.resetJob as Function

    await resetJob({ commit }, uuid)
    await expect(commit).toHaveBeenCalledWith('snackbar/SET_SNACKBAR', {
      color: 'orange',
      message: 'Job was reseted'
    })
    await expect(commit).toHaveBeenCalledWith('UPDATE_JOB', job)
  })

  it('can PUT /job update by short_uuid', async () => {
    const uuid = '2mb4-iA7p-680u-Tpaw'
    const job = jobs.find(job => job.short_uuid === uuid)
    const updatedJob = { ...job, name: 'updated name', title: 'new titile', description: 'some job description' }
    const commit = jest.fn()
    const updateJob = actions.updateJob as Function

    const state = {
      job: updatedJob
    }
    await updateJob({ state, commit })
    await expect(commit).toHaveBeenCalledWith('snackbar/SET_SNACKBAR', {
      message: 'Job was updated',
      timeout: 2000,
      color: 'light-green'
    })
    expect(commit).toHaveBeenCalledWith('UPDATE_JOB', updatedJob)
  })

  it('can reset job store', async () => {
    const commit = jest.fn()
    const resetStore = actions.resetStore as Function

    await resetStore({ commit })
    await expect(commit).toHaveBeenCalledWith('RESET_JOB_STORE')
  })
})
