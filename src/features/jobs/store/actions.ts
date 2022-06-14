import * as type from './types'
import { ActionTree } from 'vuex'
import { JobsState, JOBS_STORE } from './types'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
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
      const logger = useLogger()

      commit(type.SET_LOADING, { name: 'jobsLoading', value: false })

      logger.error('Error on load jobs list items in getJobsList action.\nError: ', error)

      return
    }
    commit(type.SET_JOBS_LIST, list)
    commit(type.SET_LOADING, { name: 'jobsLoading', value: false })
  }
}
