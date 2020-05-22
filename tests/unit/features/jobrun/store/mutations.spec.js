import { mutations } from '@/features/job/store/mutations'
import * as type from '@/features/job/store/types'
import * as data from './data'

describe('project muttions', () => {
  it('SET_JOB should update state with data in payload', () => {
    const state = {
      job: {}
    }
    mutations[type.SET_JOB](state, data.job)
    expect(state.job).toBe(data.job)
  })

  it('UPDATE_JOB should update state with data in payload', () => {
    const state = {
      job: {}
    }

    mutations[type.UPDATE_JOB](state, { title: 'new title' })
    expect(state.job).toStrictEqual({ title: 'new title' })
  })

  it('UPDATE_JOB should update state with data in payload', () => {
    const state = {
      result: 'test data',
      job: data.job
    }

    mutations[type.mutation.RESET_JOB_STORE](state)
    expect(state).toStrictEqual({
      result: '',
      job: new type.JobModel().state
    })
  })
})
