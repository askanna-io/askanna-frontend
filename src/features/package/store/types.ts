export interface PackageState extends PackageData {}

export interface PackageData {
  packageData?: Package
  processingList: any[]
  packageLoading: Boolean
}

export interface File {
  path: string
  parent: string
  size: number
  last_modified: string
  name: string
  ext: string
  type: 'file' | 'directory'
}

export interface Package {
  uuid: string
  cdn_base_url: string
  filename: string
  storage_location: string
  project: string
  size: number
  created_by: number
  created_at: string
  files: File[]
}

export const packageServiceName = 'package'
export const PACKAGE_STORE = 'packageStore'

// actions
export const getPackage = 'getPackage'
export const finishUpload = 'finishUpload'
export const registerPackage = 'registerPackage'
export const uploadChunkPackage = 'uploadChunkPackage'
export const registerChunkPackage = 'registerChunkPackage'

//mutations
export const SET_LOADING = 'SET_LOADING'
export const SET_PACKAGE = 'SET_PACKAGE'
export const SET_PROCESSING_LIST = 'SET_PROCESSING_LIST'
export const REMOVE_FROM_PROCESSING_LIST = 'REMOVE_FROM_PROCESSING_LIST'

export class PackageModel {
  private _state: Package

  constructor() {
    this._state = PackageModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      uuid: '',
      filename: '',
      cdn_base_url: '',
      storage_location: '',
      project: '',
      size: 0,
      created_by: 0,
      created_at: '',
      files: []
    }
  }
}
