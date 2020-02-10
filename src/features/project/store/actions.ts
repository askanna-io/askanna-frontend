import { apiStringify } from '@/core/api-settings'
import * as rootTypes from '@/core/store/actionTypes'

import { ActionTree } from 'vuex'
import { projectState, PROJECT_STORE, action, mutation } from './types'

const root = true
const serviceName = PROJECT_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<projectState, RootState> = {
  async [action.getProject]({ commit, dispatch, state }, id) {
    let project
    try {
      project = await dispatch(
        rootTypes.apiService,
        {
          action: api.get,
          serviceName,
          uuid: id
        },
        { root }
      )
    } catch (e) {
      console.error('Error on load project  in getProject action.\nError: ', e)
      return
    }

    commit(mutation.SET_PROJECT, project)
  }
}
