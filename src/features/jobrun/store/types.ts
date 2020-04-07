export interface jobRunState extends jobRubData {}

export interface jobRubData {
  runs: JobRun[]
  openJobRunResult: boolean
  jobRun: any
  jobRunPayload: any
}

export interface JobRun {
  uuid: string
  payload: {
    duration: number
  }
  status: string
  runtime: number
  memory: number
  return_payload: string
  stdout: any
  created: string
  finished: string
}

export const JOB_RUN_STORE = 'jobrun'

// actions
export const action = {
  getJobRun: 'getJobRun',
  resetStore: 'resetStore',
  getRunsJob: 'getRunsJob',
  getJobRunPayload: 'getJobRunPayload',
  showJobRunResult: 'showJobRunResult',
  closeResultModal: 'closeResultModal'
}

// mutations
export const mutation = {
  SET_RESULT_MODAL: 'SET_RESULT_MODAL',
  CLOSE_RESULT_MODAL: 'CLOSE_RESULT_MODAL'
}

//mutations
export const SET_JOB_RUN = 'SET_JOB_RUN'
export const SET_JOB_RUNS = 'SET_JOB_RUNS'
export const UPDATE_JOB_RESULT = 'UPDATE_JOB_RESULT'
export const SET_JOB_RUN_PAYLOAD = 'SET_JOB_RUN_PAYLOAD'
