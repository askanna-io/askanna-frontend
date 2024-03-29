export const FINISHED_STATUSES = ['failed', 'finished']

export interface LabelName {
  name: string
  type: string
}

export interface CreatedBy {
  name: string
  avatar: {
    icon: string
    large: string
    medium: string
    small: string
  }
  job_title: string
  relation: string
  role: {
    code: string
    name: string
  }
  status: string
  suuid: string
}

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
  created_at: string
  finished_at: string
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
  created_by: CreatedBy
  trigger: {
    name: string
  }
  result: {
    size: number
    name: string
    lines: number
    extension: string
    mime_type: string
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
  metrics_meta: {
    count: number
    size: number
    label_names: LabelName[]
    metric_names: LabelName[]
  }
  variables_meta: {
    count: number
    size: number
    label_names: LabelName[]
  }
  workspace: {
    name: string
    suuid: string
  }
  project: {
    name: string
    suuid: string
  }
  job: {
    name: string
    suuid: string
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
