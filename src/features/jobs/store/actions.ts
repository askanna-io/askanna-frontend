import * as type from './types'
import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import { JobsState, JOBS_STORE } from './types'
import apiService from '@/core/services/apiService'
import * as rootTypes from '@/core/store/actionTypes'
import { apiStringify } from '@/core/services/api-settings'

const serviceName = JOBS_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<JobsState, RootState> = {
  async [type.getJobsList]({ commit }) {
    commit(type.SET_LOADING, { name: 'jobsLoading', value: true })

    let list
    try {
      list = await apiService({
        action: api.list,
        serviceName
      })
    } catch (error) {
      commit(type.SET_LOADING, { name: 'jobsLoading', value: false })

      logger.error(commit, 'Error on load jobs list items in getJobsList action.\nError: ', error)

      return
    }
    commit(type.SET_JOBS_LIST, list)
    commit(type.SET_LOADING, { name: 'jobsLoading', value: false })
  }
}
