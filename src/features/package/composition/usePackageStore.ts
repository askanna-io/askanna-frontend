import { useState, useActions } from '@u3u/vue-hooks'
import {
  PACKAGE_STORE,
  getPackage,
  getFileSource,
  registerPackage,
  registerChunkPackage,
  uploadChunkPackage,
  finishUpload,
  resetFile
} from '../store/types'

export default function () {
  const state = {
    ...useState(PACKAGE_STORE, {
      file: 'file',
      fileSource: 'fileSource',
      packageData: 'packageData',
      packageLoading: 'packageLoading',
      processingList: 'processingList'
    })
  }

  const actions = {
    ...useActions(PACKAGE_STORE, [
      getPackage,
      getFileSource,
      registerPackage,
      registerChunkPackage,
      uploadChunkPackage,
      finishUpload,
      resetFile
    ])
  }

  return {
    open,
    ...state,
    ...actions
  }
}
