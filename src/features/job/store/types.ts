export interface jobState extends jobData {}

export interface jobData {
  job: Job
  result: string
}

interface Job {
  id: number
  uuid: string
  name: string
  status: string
}

export const JOB_STORE = 'job'

// actions
export const action = {
  addJob: 'addJob',
  getJob: 'getJob',
  stopJob: 'stopJob',
  killJob: 'killJob',
  pauseJob: 'pauseJob',
  resetJob: 'resetJob',
  startJob: 'startJob',
  updateJob: 'updateJob',
  getJobRun: 'getJobRun',
  removeJob: 'removeJob',
  resultJob: 'resultJob',
  resetStore: 'resetStore',
  getJobInfo: 'getJobInfo'
}

// mutations
export const mutation = {
  UPDATE_JOB_RESULT: 'UPDATE_JOB_RESULT',
  SET_RESULT_MODAL: 'SET_RESULT_MODAL',
  CLOSE_RESULT_MODAL: 'CLOSE_RESULT_MODAL'
}

export const getJob = 'getJob'
export const killJob = 'killJob'
export const startJob = 'startJob'
export const pauseJob = 'pauseJob'
export const resetJob = 'resetJob'

export const addJob = 'addJob'
export const updateJob = 'updateJob'
export const removeJob = 'removeJob'
export const getJobInfo = 'getJobInfo'

//mutations
export const SET_JOB = 'SET_JOB'
export const UPDATE_JOB = 'UPDATE_JOB'

export class JobModel {
  private _state: Job

  constructor() {
    this._state = JobModel.initialState()
  }

  get state() {
    return this._state
  }

  static initialState() {
    return {
      id: 0,
      uuid: '',
      name: '',
      status: ''
    }
  }
}
