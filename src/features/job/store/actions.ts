import * as type from './types'
import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'

import { ActionTree } from 'vuex'
import { jobState, JOB_STORE } from './types'

const root = true
const serviceName = JOB_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<jobState, RootState> = {
  async [type.getJob]({ commit, dispatch, state }, id) {
    let job
    try {
      job = await dispatch(
        rootTypes.apiService,
        {
          action: api.get,
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      console.error('Error on load job  in getJob action.\nError: ', e)
      return
    }

    commit(type.SET_JOB, job)
  },

  async [type.startJob]({ commit, dispatch, state }, id) {
    let job
    try {
      job = await dispatch(
        rootTypes.apiService,
        {
          action: api.start,
          method: 'post',
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      console.error('Error on start job  in startJob action.\nError: ', e)
      return
    }

    console.log(job)

    commit(type.UPDATE_JOB, job)
  }
}
