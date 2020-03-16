export interface PackageState extends PackageData {}

export interface PackageData {
  packageData?: Package
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
  filename: string
  storage_location: string
  project_id: number
  size: number
  created_by: number
  created_at: string
  files: File[]
}

export const packageServiceName = 'package'
export const PACKAGE_STORE = 'packageStore'

// actions
export const getPackage = 'getPackage'

//mutations
export const SET_PACKAGE = 'SET_PACKAGE'

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
      storage_location: '',
      project_id: 0,
      size: 0,
      created_by: 0,
      created_at: '',
      files: []
    }
  }
}
