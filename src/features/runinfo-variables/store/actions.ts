import { ActionTree } from 'vuex'
import { logger } from '@/core/plugins/logger'
import apiService from '@/core/services/apiService'
import { apiStringify } from '@/core/services/api-settings'

import { runInfoVariablesState, action as ac, mutation as mt } from './types'

const serviceName = 'runifo'
const apiActions = apiStringify(serviceName)

export const actions: ActionTree<runInfoVariablesState, RootState> = {
  async [ac.getVariables]({ commit }, { uuid, params }) {
    let variables

    try {
      variables = await apiService({
        uuid,
        params,
        serviceName,
        action: apiActions.getVariables
      })
    } catch (e) {
      logger.error(commit, 'Error on get variables in getVariables action.\nError: ', e)

      return
    }

    return variables
  },

  async [ac.getVariablesInitial]({ commit, dispatch }, { uuid, params, loading = 'variables' }) {
    commit(mt.SET_LOADING, { [loading]: true })

    const variables = await dispatch(ac.getVariables, { uuid, params })

    commit(mt.SET_VARIABLES_INIT, variables)
    commit(mt.SET_LOADING, { [loading]: false })
  },

  async [ac.getVariablesJSON]({ commit, dispatch }, { uuid, params, loading = true }) {
    if (loading) commit(mt.SET_LOADING, { variablesJSON: true })

    const variables = await dispatch(ac.getVariables, { uuid, params })

    commit(mt.SET_VARIABLES_JSON, variables)
    if (loading) commit(mt.SET_LOADING, { variablesJSON: false })
  },

  async [ac.getVariablesFullData]({ commit, dispatch }, { uuid, loading = false }) {
    const variables = await dispatch(ac.getVariables, { uuid })

    commit(mt.SET_VARIABLES_FULL_DATA, variables)
  },

  async [ac.getVariablesByParams]({ commit, dispatch }, { uuid, params, loading = false }) {
    if (loading) commit(mt.SET_LOADING, { variablesByParams: true })

    const variables = await dispatch(ac.getVariables, { uuid, params })

    commit(mt.SET_VARIABLES, variables)
    if (loading) commit(mt.SET_LOADING, { variablesByParams: false })
  },

  async [ac.setLoading]({ commit }, data) {
    commit(mt.SET_LOADING, data)
  },

  async [ac.setIsFiltered]({ commit }, val) {
    commit(mt.SET_IS_FILTERED, val)
  }
}
