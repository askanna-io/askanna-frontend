import { set } from 'lodash'
import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'
import { Variable, VARIABLES_STORE } from './types'

const serviceName = VARIABLES_STORE
const api = apiStringify(serviceName)

export const useVariablesStore = defineStore(VARIABLES_STORE, {
  state: () => {
    return {
      variable: {} as Variable,
      variables: {
        count: 0,
        next: null,
        previous: null,
        results: [] as Variable[]
      },
      variablePopup: false,
      variablesLoading: true,
      variableConfirmDeletePopup: false
    }
  },

  actions: {
    async getVariables({ loading, params, initial, suuid: project_suuid } = { loading: true, params: {}, initial: false, suuid: '' }) {
      if (loading) this.variablesLoading = true

      try {
        const data = await apiService({
          serviceName,
          action: api.list,
          params: { ...params, project_suuid },
        })

        this.variables = initial ? data : { ...data, results: data.results }
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load variables in getVariables action.\nError: ', error)
      }

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
        })
      } catch (error) {
        logger.error('Error on create variable in createVariable action.\nError: ', error)

        return error
      }

      logger.success(`The variable ${variable.name} is created`)

      await this.getVariables({ suuid: data.project_suuid, initial: true })
    },

    async getVariable({ projectId: project_suuid, variableId: suuid }: { projectId:string, variableId:string }) {
      let variable

      try {
        variable = await apiService({
          suuid,
          serviceName,
          action: api.update,
          params:{ project_suuid },
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load variable in getVariable action.\nError: ', error)

        return
      }
      this.variable = variable
    },

    async updateVariable({ projectId: project_suuid, variableId: suuid, ...data }) {
      const logger = useLogger()

      try {
        await apiService({
          data,
          suuid,
          serviceName,
          method: 'PATCH',
          action: api.update,
          params: { project_suuid },
        })
      } catch (error) {
        logger.error('Error on update variable in updateVariable action.\nError: ', error)

        return error
      }

      logger.success(`The variable ${name} is updated`)

      await this.getVariables({ suuid: project_suuid })
    },

    async deleteVariable({ name, projectId: project_suuid, variableId: suuid }) {
      const logger = useLogger()

      try {
        await apiService({
          suuid,
          serviceName,
          method: 'delete',
          action: api.update,
          params: { project_suuid },
        })
      } catch (error) {
        logger.error('Error on delete variable in deleteVariable action.\nError: ', error)

        return
      }

      logger.success(`The variable ${name} is deleted`)

      await this.getVariables({ suuid: project_suuid })
    },

    setVariable({ path, value }) {
      set(this.variable, path, value)
    },

    setEditVariable(data) {
      this.variable = data
    },

    resetVariable() {
      this.variable = {} as Variable
    }
  }
})
