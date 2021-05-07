export interface jobRunState extends jobRubData {}

export interface jobRubData {
  runs: { count: number; results: JobRun[]; next: null | string }
  openJobRunResult: boolean
  jobRun: JobRun
  jobRunPayload: string | null | undefined
  jobRunLoading: Boolean
  resultLoading: Boolean
  payLoadLoading: Boolean
  jobRunsLoading: Boolean
  jobRunlogLoading: Boolean
  jobRunArtifactLoading: Boolean
  jobRunResult: any
  jobRunResultExt: string
  jobRunResultPreview: any
  isJobRunResultBig: Boolean
  isResultJSON: Boolean
  isShowPreview: Boolean
  jobRunLog: {
    count: number
    next: null | string
    results: any[]
  }
  jobRunLogFullVersion: any[]
  artifactData?: Package
  file: string
  fileSource: Blob
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

export interface JobRun {
  name: string
  description: string
  uuid: string
  short_uuid: string
  payload: {
    duration: number
    short_uuid: string
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
    uuid: string
  }
  package: {
    name: string
    uuid: string
    short_uuid: string
  }
  runner: {
    cpu_cores: number
    cpu_time: number
    job_status: number
    memory_mib: number
    name: string
    uuid: string
  }
  owner: {
    name: string
  }
  trigger: {
    name: string
  }
}

export const JOB_RUN_STORE = 'jobrun'

// actions
export const action = {
  resetFile: 'resetFile',
  getJobRun: 'getJobRun',
  setLoading: 'setLoading',
  resetStore: 'resetStore',
  getRunsJob: 'getRunsJob',
  udapteJobRun: 'udapteJobRun',
  getJobRunLog: 'getJobRunLog',
  getFileSource: 'getFileSource',
  resetJobRunLog: 'resetJobRunLog',
  downloadPackage: 'downloadPackage',
  getJobRunResult: 'getJobRunResult',
  getTargetPackage: 'getTargetPackage',
  getInitJobRunLog: 'getInitJobRunLog',
  getJobRunPayload: 'getJobRunPayload',
  showJobRunResult: 'showJobRunResult',
  closeResultModal: 'closeResultModal',
  getJobRunArtifact: 'getJobRunArtifact',
  getJobRunResultPreview: 'getJobRunResultPreview',
  getFullVersionJobRunLog: 'getFullVersionJobRunLog',
  getInitialJobRunArtifact: 'getInitialJobRunArtifact'
}

// mutations
export const mutation = {
  SET_FILE: 'SET_FILE',
  SET_LOADING: 'SET_LOADING',
  SET_RESULT_MODAL: 'SET_RESULT_MODAL',
  RESET_JOB_RUN_LOG: 'RESET_JOB_RUN_LOG',
  CLOSE_RESULT_MODAL: 'CLOSE_RESULT_MODAL',
  UPDATE_JOB_RUN_STORE: 'UPDATE_JOB_RUN_STORE',
  RESET_FILE_FILESOURCE: 'RESET_FILE_FILESOURCE'
}

//mutations
export const SET_JOB_RUN = 'SET_JOB_RUN'
export const SET_JOB_RUNS = 'SET_JOB_RUNS'
export const SET_JOB_RUN_LOG = 'SET_JOB_RUN_LOG'
export const UPDATE_JOB_RESULT = 'UPDATE_JOB_RESULT'
export const SET_JOB_RUN_RESULT = 'SET_JOB_RUN_RESULT'
export const SET_JOB_RUN_PAYLOAD = 'SET_JOB_RUN_PAYLOAD'
export const SET_JOB_RUN_ARTIFACT = 'SET_JOB_RUN_ARTIFACT'
export const SET_JOB_RUN_RESULT_PREVIEW = 'SET_JOB_RUN_RESULT_PREVIEW'
export const SET_JOB_RUN_LOG_FULL_VERSION = 'SET_JOB_RUN_LOG_FULL_VERSION'

export const stateType = {
  file: 'file',
  runs: 'runs',
  jobRun: 'jobRun',
  jobRunLog: 'jobRunLog',
  fileSource: 'fileSource',
  logLoading: 'logLoading',
  isResultJSON: 'isResultJSON',
  artifactData: 'artifactData',
  jobRunResult: 'jobRunResult',
  jobRunPayload: 'jobRunPayload',
  jobRunLoading: 'jobRunLoading',
  isShowPreview: 'isShowPreview',
  resultLoading: 'resultLoading',
  jobRunsLoading: 'jobRunsLoading',
  payLoadLoading: 'payLoadLoading',
  jobRunResultExt: 'jobRunResultExt',
  jobRunlogLoading: 'jobRunlogLoading',
  isJobRunResultBig: 'isJobRunResultBig',
  jobRunResultPreview: 'jobRunResultPreview',
  jobRunLogFullVersion: 'jobRunLogFullVersion',
  jobRunArtifactLoading: 'jobRunArtifactLoading'
}

export class JobRunModel {
  private _state: JobRun

  constructor() {
    this._state = JobRunModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      uuid: '',
      name: '',
      description: '',
      short_uuid: '',
      payload: {
        duration: 0,
        short_uuid: ''
      },
      status: '',
      runtime: 0,
      memory: 0,
      return_payload: '',
      stdout: [],
      created: '',
      finished: '',
      version: {
        name: '',
        uuid: ''
      },
      package: {
        name: '',
        uuid: '',
        short_uuid: ''
      },
      artifact: {
        name: '',
        uuid: '',
        short_uuid: ''
      },
      runner: {
        cpu_cores: 0,
        cpu_time: 0,
        job_status: 0,
        memory_mib: 0,
        name: '',
        uuid: ''
      },
      owner: {
        name: ''
      },
      trigger: {
        name: ''
      },
      variablesmeta: { count: 0, size: 0, labels: ['source'], keys: [] },
      count: 0,
      keys: [],
      labels: [],
      size: 0
    }
  }
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
export class ArtifactModel {
  private _state: Package

  constructor() {
    this._state = ArtifactModel.initialState()
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
