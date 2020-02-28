import { computed } from '@vue/composition-api'
import { useState, useActions } from '@u3u/vue-hooks'
import { action } from '@/features/job/store/types'

const { showJobRunResult, closeResultModal } = action

export default function() {
  const state = {
    ...useState('job', { openJobRunResult: 'openJobRunResult' })
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
