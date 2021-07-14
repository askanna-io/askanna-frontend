import { Module } from 'vuex'
import { getters } from './getters'
import { actions } from './actions'
import { mutations } from './mutations'
import { generalState, GENERAL_STORE } from './types'

export const state: generalState = {
  projectId: '',
  breadcrumbParams: {
    jobId: '',
    jobRunId: '',
    projectId: '',
    workspaceId: ''
  },
  interval: new Map()
}

const namespaced: boolean = true
export const name: string = GENERAL_STORE
export const general: Module<generalState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
