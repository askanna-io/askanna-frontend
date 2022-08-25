export interface File {
  ext: string
  path: string
  size: number
  name: string
  parent: string
  last_modified: string
  type: 'file' | 'directory'
}

export interface Package {
  uuid: string
  files: File[]
  size: number
  created: string
  filename: string
  project: string
  short_uuid: string
  created_by: number
  created_at: string
  cdn_base_url: string
  storage_location: string
}
