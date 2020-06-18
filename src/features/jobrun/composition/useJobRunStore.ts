import { useState, useActions } from '@u3u/vue-hooks'
import { JOB_RUN_STORE, action, stateType } from '../store/types'

export default function () {
  const state = {
    ...useState(JOB_RUN_STORE, {
      runs: 'runs',
      jobRun: 'jobRun',
      jobRunResult: 'jobRunResult',
      jobRunPayload: 'jobRunPayload',
      ...stateType
    })
  }

  const actions = {
    ...useActions(JOB_RUN_STORE, { ...action })
  }

  return {
    open,
    ...state,
    ...actions
  }
}
