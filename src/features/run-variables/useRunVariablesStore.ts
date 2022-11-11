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
        variables: false,
        variablesJSON: false,
        variablesByParams: false
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

    async getVariablesInitial({ suuid, params, loading = 'variables' }) {
      this.loading = { ...this.loading, ...{ [loading]: true } }

      const variables = await this.getVariables({ suuid, params })

      this.variables = variables
      this.loading = { ...this.loading, ...{ [loading]: false } }
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

    async getVariablesByParams({ suuid, params, loading = false }) {
      if (loading) this.loading.variablesByParams = true

      const variables = await dispatch(ac.getVariables, { suuid, params })

      const { count, results, next } = variables
      this.variables = {
        next,
        count,
        results: [...this.variables.results, ...results]
      }
      if (loading) this.loading.variablesByParams = false
    },

    async setLoading(data) {
      this.loading = { ...this.loading, ...data }
    },

    async setIsFiltered(val) {
      this.isFiltered = val
    }
  }
})
