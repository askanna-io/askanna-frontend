import { useState, useActions } from '@u3u/vue-hooks'
import { PACKAGE_STORE, getPackage } from '../store/types'

export default function() {
  const state = {
    ...useState(PACKAGE_STORE, { packageData: 'packageData' })
  }

  const actions = {
    ...useActions(PACKAGE_STORE, [getPackage])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
