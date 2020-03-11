import { useState, useActions } from '@u3u/vue-hooks'
import { PACKAGES_STORE, getProjectPackages, downloadPackage } from '../store/types'

export default function() {
  const state = {
    ...useState(PACKAGES_STORE, { projectPackages: 'projectPackages' })
  }

  const actions = {
    ...useActions(PACKAGES_STORE, [getProjectPackages, downloadPackage])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
