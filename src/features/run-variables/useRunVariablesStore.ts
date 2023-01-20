import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { RUNIFO_VARIABLES_STORE } from './types'
import { apiStringify } from '@/services/api-settings'

const serviceName = 'runifo'
const apiActions = apiStringify(serviceName)

export const useRunVariablesStore = defineStore(RUNIFO_VARIABLES_STORE, {
  state: () => {
    return {
      isFiltered: false,
      variables: {
        count: 0,
        next: null,
        previous: null,
        results: []
      },
      variablesFullData: '',
      variablesLabels: [],
      variablesJSON: {
        count: 0,
        next: null,
        results: []
      },
      loading: {
        variables: true,
        variablesJSON: false,
        variablesByParams: true
      }
    }
  },

  actions: {
    async getVariables({ suuid, params }) {
      let variables

      try {
        variables = await apiService({
          suuid,
          params,
          serviceName,
          action: apiActions.getVariables
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on get variables in getVariables action.\nError: ', e)

        return
      }

      return variables
    },

    async getVariablesJSON({ suuid, params, loading = true }) {
      if (loading) this.loading.variablesJSON = true

      const variables = await this.getVariables({ suuid, params })

      const { count, results, next } = variables

      this.variablesJSON = {
        next,
        count,
        results: [...this.variablesJSON.results, ...results]
      }
      if (loading) this.loading.variablesJSON = false
    },

    async getVariablesFullData({ suuid, loading = false }) {
      const variables = await this.getVariables({ suuid })

      this.variablesFullData = JSON.stringify(variables, null, 2)
    },

    async getVariablesByParams(
      { loading, params, initial, suuid } = { loading: true, params: {}, initial: false, suuid: '' }
    ) {
      if (loading) this.loading.variablesByParams = true

      const data = await this.getVariables({ suuid, params })

      this.variables = initial ? data : { ...data, results: [...this.variables.results, ...data.results] }

      this.loading.variablesByParams = false
    },

    async setLoading(data) {
      this.loading = { ...this.loading, ...data }
    },

    async setIsFiltered(val) {
      this.isFiltered = val
    }
  }
})
