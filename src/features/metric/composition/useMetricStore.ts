import { useState, useActions } from '@u3u/vue-hooks'
import { METRIC_STORE, action, stateType } from '../store/types'

export default function () {
  const state = {
    ...useState(METRIC_STORE, {
      metrics: stateType.metrics,
      loading: stateType.loading,
      isFiltered: stateType.isFiltered,
      metricJSON: stateType.metricJSON,
      metricLabels: stateType.metricLabels,
      metricFullData: stateType.metricFullData
    })
  }

  const actions = {
    ...useActions(METRIC_STORE, { ...action })
  }

  return {
    state,
    actions
  }
}
