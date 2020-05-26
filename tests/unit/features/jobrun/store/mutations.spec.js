import { mutations } from '@/features/jobrun/store/mutations'
import * as type from '@/features/jobrun/store/types'
import * as data from './data'

describe('jobrun muttions', () => {
  it('SET_JOB_RUN should update state with data in payload', () => {
    const state = {
      jobRun: {}
    }
    mutations[type.SET_JOB_RUN](state, data.jobrun)
    expect(state.jobRun).toBe(data.jobrun)
  })

  it('SET_JOB_RUNS should update state with data in payload', () => {
    const state = {
      runs: {}
    }

    mutations[type.SET_JOB_RUNS](state, data.jobruns)
    expect(state.runs).toStrictEqual(data.jobruns)
  })

  it('CLOSE_RESULT_MODAL should change openJobRunResult to false', () => {
    const state = {
      openJobRunResult: true
    }

    mutations[type.mutation.CLOSE_RESULT_MODAL](state)
    expect(state).toStrictEqual({
      openJobRunResult: false
    })
  })

  it('SET_RESULT_MODAL should change openJobRunResult to true', () => {
    const state = {
      openJobRunResult: false
    }

    mutations[type.mutation.SET_RESULT_MODAL](state)
    expect(state).toStrictEqual({
      openJobRunResult: true
    })
  })

  it('SET_JOB_RUN_PAYLOAD should update state with data in payload', () => {
    const state = {
      jobRunPayload: {}
    }

    const payload = { duratation: '3' }

    mutations[type.SET_JOB_RUN_PAYLOAD](state, payload)
    expect(state).toStrictEqual({
      jobRunPayload: payload
    })
  })

  it('UPDATE_JOB_RUN_STORE should update state with reset data', () => {
    const state = {
      runs: data.jobruns,
      jobRun: data.jobrun,
      jobRunPayload: { duratation: '3' }
    }

    mutations[type.mutation.UPDATE_JOB_RUN_STORE](state)
    expect(state).toStrictEqual({
      runs: [],
      jobRun: new type.JobRunModel().state,
      jobRunPayload: ''
    })
  })

  it('SET_LOADING should change loading by name and value', () => {
    const state = {
      payLoadLoading: false
    }

    mutations[type.mutation.SET_LOADING](state, { name: 'payLoadLoading', value: true })
    expect(state).toStrictEqual({
      payLoadLoading: true
    })
  })
})
