export interface PackagesState extends Packages {}

export interface Packages {
  projectPackages: Package[]
  projectPackageHistory: Package[]
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

export const PACKAGES_STORE = 'packages'

// actions
export const resetStore = 'resetStore'
export const getProjectPackages = 'getProjectPackages'
export const downloadPackage = 'downloadPackage'
export const getTargetPackage = 'getTargetPackage'

//mutations
export const RESET_STORE = 'RESET_STORE'
export const SET_PROJECT_PACKAGES = 'SET_PROJECT_PACKAGES'
