import * as type from './types'
import { ActionTree } from 'vuex'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { VariablesState, VARIABLES_STORE } from './types'
import { apiStringify } from '@/core/services/api-settings'

const serviceName = VARIABLES_STORE
const api = apiStringify(serviceName)

export const actions: ActionTree<VariablesState, RootState> = {
  async [type.action.getVariables]({ commit }, uuid) {
    commit(type.mutation.SET_LOADING, { name: 'variablesLoading', value: true })

    let variables
    try {
      variables = await apiService({
        action: api.list,
        serviceName,
        uuid
      })
    } catch (error) {
      const logger = useLogger()

      logger.error('Error on load variables in getVariables action.\nError: ', error)
      commit(type.mutation.SET_LOADING, { name: 'variablesLoading', value: false })

      return
    }

    commit(type.mutation.SET_VARIABLES, variables)
    commit(type.mutation.SET_LOADING, { name: 'variablesLoading', value: false })
  },

  async [type.action.createVariable]({ dispatch }, data) {
    const logger = useLogger()

    let variable
    try {
      variable = await apiService({
        action: api.list,
        method: 'post',
        serviceName,
        uuid: data.project,
        data
      })
    } catch (error) {
      logger.error('Error on create variable in createVariable action.\nError: ', error)

      return error
    }

    logger.success(`The variable ${variable.name} is created`)

    await dispatch(type.action.getVariables, data.project)
  },

  async [type.action.getVariable]({ commit }, uuid) {
    let variable
    try {
      variable = await apiService({
        action: api.update,
        serviceName,
        uuid
      })
    } catch (error) {
      const logger = useLogger()

      logger.error('Error on load variable in getVariable action.\nError: ', error)

      return
    }
    commit(type.mutation.SET_EDIT_VARIABLE, variable)
  },

  async [type.action.updateVariable]({ dispatch }, { projectId, variableId, ...data }) {
    const logger = useLogger()

    try {
      await apiService({
        action: api.update,
        method: 'PATCH',
        serviceName,
        data,
        uuid: { projectId, variableId }
      })
    } catch (error) {
      logger.error('Error on update variable in updateVariable action.\nError: ', error)

      return error
    }

    logger.success(`The variable ${name} is updated`)

    await dispatch(type.action.getVariables, projectId)
  },

  async [type.action.deleteVariable]({ dispatch }, { name, projectId, variableId }) {
    const logger = useLogger()

    let variable
    try {
      variable = await apiService({
        action: api.update,
        method: 'delete',
        serviceName,
        uuid: { projectId, variableId }
      })
    } catch (error) {
      logger.error('Error on delete variable in deleteVariable action.\nError: ', error)

      return
    }

    logger.success(`The variable ${name} is deleted`)

    await dispatch(type.action.getVariables, projectId)
  },

  [type.action.setVariablePopUp]({ commit }, value) {
    commit(type.mutation.SET_VARIABLE_POPUP, value)
  },

  [type.action.setVariable]({ commit }, data) {
    commit(type.mutation.SET_VARIABLE, data)
  },

  [type.action.setEditVariable]({ commit }, data) {
    commit(type.mutation.SET_EDIT_VARIABLE, data)
  },

  [type.action.resetVariable]({ commit }) {
    commit(type.mutation.RESET_VARIABLE)
  }
}
