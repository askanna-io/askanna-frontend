import { useState, useActions } from '@u3u/vue-hooks'
import { PACKAGES_STORE, getProjectPackages, downloadPackage, resetStore } from '../store/types'

export default function () {
  const state = {
    ...useState(PACKAGES_STORE, {
      projectPackages: 'projectPackages',
      loadingPackages: 'loadingPackages',
      projectPackageHistory: 'projectPackageHistory'
    })
  }

  const actions = {
    ...useActions(PACKAGES_STORE, [getProjectPackages, downloadPackage, resetStore])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
