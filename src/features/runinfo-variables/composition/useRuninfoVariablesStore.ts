import { useState, useActions } from '@u3u/vue-hooks'
import { RUNIFO_VARIABLES_STORE, action, stateType } from '../store/types'

export default function () {
  const state = {
    ...useState(RUNIFO_VARIABLES_STORE, {
      loading: stateType.loading,
      variables: stateType.variables,
      isFiltered: stateType.isFiltered,
      variablesJSON: stateType.variablesJSON,
      variablesLabels: stateType.variablesLabels,
      variablesFullData: stateType.variablesFullData
    })
  }

  const actions = {
    ...useActions(RUNIFO_VARIABLES_STORE, { ...action })
  }

  return {
    state,
    actions
  }
}
