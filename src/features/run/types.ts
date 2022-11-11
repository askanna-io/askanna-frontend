export const FINISHED_STATUSES = ['failed', 'finished', 'completed']

export interface Package {
  suuid: string
  cdn_base_url: string
  filename: string
  storage_location: string
  project: string
  size: number
  created_by: number
  created_at: string
  files: File[]
}

export interface Run {
  name: string
  duration: number | null
  description: string
  suuid: string
  payload: {
    duration: number
    suuid: string
    size: number | string
  }
  status: string
  runtime: number
  memory: number
  return_payload: string
  stdout: any[]
  created: string
  finished: string
  version: {
    name: string
    suuid: string
  }
  package: {
    name: string
    suuid: string
  }
  runner: {
    cpu_cores: number
    cpu_time: number
    job_status: number
    memory_mib: number
    name: string
    suuid: string
  }
  created_by: {
    name: string
  }
  trigger: {
    name: string
  }
  result: {
    extension: string
    lines: number
    mimetype: string
    name: string
    size: number
  }
  environment: {
    description?: string
    image: {
      digest: string
      name: string
      tag: string
    }
    name: string
    label?: string
    timezone: string
  }
}
export interface File {
  path: string
  parent: string
  file: 'file' | 'directory'
  size: number
  last_modified: string
  name: string
  type: string
  ext: string
}
