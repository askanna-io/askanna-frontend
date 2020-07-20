export interface PackageState extends PackageData {}

export interface PackageData {
  packageData?: Package
  file: string
  fileSource: Blob
  processingList: any[]
}

export interface File {
  path: string
  parent: string
  is_dir: boolean
  size: number
  last_modified: string
  name: string
  type: string
  ext: string
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
export const resetFile = 'resetFile'
export const getPackage = 'getPackage'
export const finishUpload = 'finishUpload'
export const getFileSource = 'getFileSource'
export const registerPackage = 'registerPackage'
export const uploadChunkPackage = 'uploadChunkPackage'
export const registerChunkPackage = 'registerChunkPackage'

//mutations
export const SET_FILE = 'SET_FILE'
export const SET_PACKAGE = 'SET_PACKAGE'
export const RESET_FILE_FILESOURCE = 'RESET_FILE_FILESOURCE'
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
