import { useState, useActions } from '@u3u/vue-hooks'
import { JOB_STORE, action } from '../store/types'

export default function() {
  const state = {
    ...useState(JOB_STORE, {
      job: 'job',
      result: 'result',
      runs: 'runs',
      jobRun: 'jobRun',
      jobRunPayload: 'jobRunPayload'
    })
  }

  const actions = {
    ...useActions(JOB_STORE, { ...action })
  }

  return {
    open,
    ...state,
    ...actions
  }
}
