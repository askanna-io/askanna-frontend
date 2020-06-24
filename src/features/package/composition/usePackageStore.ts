import { useState, useActions } from '@u3u/vue-hooks'
import { PACKAGE_STORE, getPackage, getFileSource, uploadPackage, finishUpload } from '../store/types'

export default function () {
  const state = {
    ...useState(PACKAGE_STORE, { packageData: 'packageData', file: 'file', fileSource: 'fileSource' })
  }

  const actions = {
    ...useActions(PACKAGE_STORE, [getPackage, getFileSource, uploadPackage, finishUpload])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
