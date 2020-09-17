export interface PackagesState extends Packages {}

export interface Packages {
  loadingPackages: Boolean
  projectPackages: {
    count: number
    next: null | string
    results: Package[]
  }
}

export interface Package {
  uuid: string
  filename: string
  storage_location: string
  project_id: number
  size: number
  created_by: number
  created_at: string
}

export const stateType = {
  projectPackages: 'projectPackages',
  loadingPackages: 'loadingPackages',
  projectPackageHistory: 'projectPackageHistory'
}

export const PACKAGES_STORE = 'packages'

// actions
export const action = {
  resetStore: 'resetStore',
  downloadPackage: 'downloadPackage',
  getTargetPackage: 'getTargetPackage',
  getProjectPackages: 'getProjectPackages',
  getInitialProjectPackages: 'getInitialProjectPackages'
}

//mutations
export const SET_LOADING = 'SET_LOADING'
export const RESET_STORE = 'RESET_STORE'
export const SET_PROJECT_PACKAGES = 'SET_PROJECT_PACKAGES'
