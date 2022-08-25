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

export const PACKAGES_STORE = 'packages'
