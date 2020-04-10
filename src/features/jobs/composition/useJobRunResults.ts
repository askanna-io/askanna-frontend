import { computed } from '@vue/composition-api'
import { action } from '@/features/jobrun/store/types'
import { useState, useActions } from '@u3u/vue-hooks'

const { showJobRunResult, closeResultModal } = action

export default function() {
  const state = {
    ...useState('jobrun', { openJobRunResult: 'openJobRunResult' })
  }

  const openVmodel = computed({
    get: () => {
      return state.openJobRunResult.value
    },
    set: () => {
      actions.closeResultModal()
    }
  })

  const actions = {
    ...useActions('job', [showJobRunResult, closeResultModal])
  }

  return {
    openVmodel,
    ...state,
    ...actions
  }
}
