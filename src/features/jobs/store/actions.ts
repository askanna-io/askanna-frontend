import * as type from './types'
import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import { JobsState, JOBS_STORE } from './types'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'

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
    // @TODO #1 refactore after implement job list on backend
    list.forEach(async (element: any, index: number) => {
      const jobInfo = await dispatch(`job/getJobInfo`, element.id, { root })
      const data = { ...element, status: jobInfo.status }

      commit(type.UDPDATE_LIST, { data, index })
    })
  }
}
