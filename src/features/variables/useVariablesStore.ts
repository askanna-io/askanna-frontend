import { set } from 'lodash'
import { defineStore } from 'pinia'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { VariableModel, VARIABLES_STORE } from './types'
import { apiStringify } from '@/core/services/api-settings'

const serviceName = VARIABLES_STORE
const api = apiStringify(serviceName)

export const useVariablesStore = defineStore(VARIABLES_STORE, {
  state: () => {
    return {
      variable: new VariableModel().state,
      variables: [],
      variablePopup: false,
      variablesLoading: true,
      variableConfirmDeletePopup: false
    }
  },

  actions: {
    async getVariables(uuid) {
      this.variablesLoading = true

      let variables
      try {
        variables = await apiService({
          uuid,
          serviceName,
          action: api.list
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load variables in getVariables action.\nError: ', error)
        this.variablesLoading = false

        return
      }

      this.variables = variables
      this.variablesLoading = false
    },

    async createVariable(data) {
      const logger = useLogger()

      let variable
      try {
        variable = await apiService({
          data,
          serviceName,
          method: 'post',
          action: api.list,
          uuid: data.project
        })
      } catch (error) {
        logger.error('Error on create variable in createVariable action.\nError: ', error)

        return error
      }

      logger.success(`The variable ${variable.name} is created`)

      await this.getVariables(data.project)
    },

    async getVariable(uuid) {
      let variable
      try {
        variable = await apiService({
          uuid,
          serviceName,
          action: api.update
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load variable in getVariable action.\nError: ', error)

        return
      }
      this.variable = variable
    },

    async updateVariable({ projectId, variableId, ...data }) {
      const logger = useLogger()

      try {
        await apiService({
          data,
          serviceName,
          method: 'PATCH',
          action: api.update,
          uuid: { projectId, variableId }
        })
      } catch (error) {
        logger.error('Error on update variable in updateVariable action.\nError: ', error)

        return error
      }

      logger.success(`The variable ${name} is updated`)

      await this.getVariables(projectId)
    },

    async deleteVariable({ name, projectId, variableId }) {
      const logger = useLogger()

      try {
        await apiService({
          serviceName,
          method: 'delete',
          action: api.update,
          uuid: { projectId, variableId }
        })
      } catch (error) {
        logger.error('Error on delete variable in deleteVariable action.\nError: ', error)

        return
      }

      logger.success(`The variable ${name} is deleted`)

      await this.getVariables(projectId)
    },

    setVariable({ path, value }) {
      set(this.variable, path, value)
    },

    setEditVariable(data) {
      this.variable = data
    },

    resetVariable() {
      this.variable = new VariableModel().state
    }
  }
})
