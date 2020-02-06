import { computed } from '@vue/composition-api'
import { useState, useActions } from '@u3u/vue-hooks'
import { JOB_STORE, actionTypes } from '../store/types'

export default function() {
  const state = {
    ...useState(JOB_STORE, { job: 'job' })
  }

  const actions = {
    ...useActions(JOB_STORE, [...actionTypes])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
