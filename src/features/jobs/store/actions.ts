import * as type from './types'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'
import { logger } from '@/core/plugins/logger'

import { ActionTree } from 'vuex'
import { JobsState, JOBS_STORE } from './types'

const root = true
const serviceName = JOBS_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<JobsState, RootState> = {
  async [type.getJobsList]({ commit, dispatch, state }) {
    let list
    try {
      list = await dispatch(
        rootTypes.apiService,
        {
          action: api.list,
          serviceName
        },
        { root }
      )
    } catch (e) {
      logger.error('Error on load jobs list items in getJobsList action.\nError: ', e)
      return
    }

    commit(type.SET_JOBS_LIST, list)
  }
}
