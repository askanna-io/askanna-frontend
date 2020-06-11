import { useState, useActions } from '@u3u/vue-hooks'
import { PACKAGE_STORE, getPackage, getFileSource, uploadPackage } from '../store/types'

export default function () {
  const state = {
    ...useState(PACKAGE_STORE, { packageData: 'packageData', file: 'file', fileSource: 'fileSource' })
  }

  const actions = {
    ...useActions(PACKAGE_STORE, [getPackage, getFileSource, uploadPackage])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
