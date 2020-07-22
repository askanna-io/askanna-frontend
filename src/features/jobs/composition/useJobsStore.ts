import { useState, useActions } from '@u3u/vue-hooks'
import { JOBS_STORE, getJobsList } from '../store/types'

export default function () {
  const state = {
    ...useState(JOBS_STORE, { list: 'list', jobsLoading: 'jobsLoading' })
  }

  const actions = {
    ...useActions(JOBS_STORE, [getJobsList])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
