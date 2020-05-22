import { mutations } from '@/features/jobs/store/mutations'
import { SET_JOBS_LIST } from '@/features/jobs/store/types'
import * as data from './data'

describe('project muttions', () => {
  it('SET_JOBS_LIST should update state with data in payload', () => {
    const state = {
      list: {}
    }

    mutations[SET_JOBS_LIST](state, data.jobs)
    expect(state.list).toBe(data.jobs)
  })
})
