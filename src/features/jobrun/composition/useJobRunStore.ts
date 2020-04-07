import { useState, useActions } from '@u3u/vue-hooks'
import { JOB_RUN_STORE, action } from '../store/types'

export default function() {
  const state = {
    ...useState(JOB_RUN_STORE, {
      runs: 'runs',
      jobRun: 'jobRun',
      jobRunPayload: 'jobRunPayload'
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
