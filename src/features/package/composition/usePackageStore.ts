import { useState, useActions } from '@u3u/vue-hooks'
import {
  PACKAGE_STORE,
  getPackage,
  getFileSource,
  registerPackage,
  registerChunkPackage,
  uploadChunkPackage,
  finishUpload
} from '../store/types'

export default function () {
  const state = {
    ...useState(PACKAGE_STORE, { packageData: 'packageData', file: 'file', fileSource: 'fileSource' })
  }

  const actions = {
    ...useActions(PACKAGE_STORE, [
      getPackage,
      getFileSource,
      registerPackage,
      registerChunkPackage,
      uploadChunkPackage,
      finishUpload
    ])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
