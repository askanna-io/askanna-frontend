export interface jobState extends jobData {}

export interface jobData {
  job: Job
}

interface Job {
  id: number
  uuid: string
  name: string
  status: string
}

export const JOB_STORE = 'job'

// actions
export const getJob = 'getJob'
export const killJob = 'killJob'
export const startJob = 'startJob'
export const pauseJob = 'pauseJob'
export const resetJob = 'resetJob'

export const addJob = 'addJob'
export const updateJob = 'updateJob'
export const removeJob = 'removeJob'
export const getJobInfo = 'getJobInfo'

export const actionTypes = [getJob, killJob, startJob, pauseJob, addJob, updateJob, removeJob, getJobInfo]

//mutations
export const SET_JOB = 'SET_JOB'
export const UPDATE_JOB = 'UPDATE_JOB'
