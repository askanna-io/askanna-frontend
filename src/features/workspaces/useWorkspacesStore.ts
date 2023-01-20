import { get } from 'lodash'
import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const serviceName = 'workspace'
const api = apiStringify(serviceName)

export const useWorkspacesStore = defineStore('workspaces', {
  state: () => {
    return {
      loading: true,
      loadingAll: true,
      query: {
        page_size: 25
      },
      workspaces: {
        count: 0,
        next: '',
        previous: '',
        results: []
      },
      menu: {
        isOpen: false,
        loading: true,
        isShowSearch: false,
        query: {
          search: null,
          page_size: 9
        },
        workspaces: {
          count: 0,
          next: '',
          previous: '',
          results: []
        }
      },
      memberWorkspace: { suuid: '' }
    }
  },
  getters: {
    getMemberWorkspaceSUUID: state => state.memberWorkspace.suuid
  },

  actions: {
    async getMemberWorkspace() {
      try {
        const data = await apiService({
          serviceName,
          action: api.list,
          params: { page_size: 1, is_member: true }
        })

        this.memberWorkspace = get(data, ['results', 0], { suuid: '' })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on get workspaces in getMemberWorkspace action.\nError: ', error)
      }
    },

    async getMenuWorkspaces({ params, loading } = { loading: true, params: {} }) {
      this.menu.loading = loading

      try {
        this.menu.workspaces = await apiService({
          serviceName,
          action: api.list,
          params: { ...this.menu.query, ...params }
        })

        if (!this.menu.isShowSearch) this.menu.isShowSearch = this.menu.workspaces.count > 9
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on get workspaces in getMemberWorkspaces action.\nError: ', error)
      }

      this.menu.loading = false
    },

    async getWorkspaces({ loading, params, initial } = { loading: true, params: {}, initial: false }) {
      if (loading) this.loadingAll = loading
      try {
        const data = await apiService({
          params,
          serviceName,
          action: api.list
        })

        this.workspaces = initial ? data : { ...data, results: [...this.workspaces.results, ...data.results] }
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on get workspaces in getWorkspaces action.\nError: ', error)
      }

      this.loadingAll = false
    }
  }
})
