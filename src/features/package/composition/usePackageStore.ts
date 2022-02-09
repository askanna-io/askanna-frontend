import { useState, useActions } from '@u3u/vue-hooks'
import {
  PACKAGE_STORE,
  getPackage,
  registerPackage,
  registerChunkPackage,
  uploadChunkPackage,
  finishUpload
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
    ...useActions(PACKAGE_STORE, [getPackage, registerPackage, registerChunkPackage, uploadChunkPackage, finishUpload])
  }

  return {
    open,
    ...state,
    ...actions,
    state,
    actions
  }
}
