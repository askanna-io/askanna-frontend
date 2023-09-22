import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const serviceName = 'project'
const api = apiStringify(serviceName)

export const useProjectsStore = defineStore('projects', {
  state: () => {
    return {
      loading: true,
      projects: {
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
        projects: {
          count: 0,
          next: '',
          previous: '',
          results: []
        }
      }
    }
  },
  actions: {
    async getMenuProjects({ params, loading } = { loading: true, params: {} }) {
      this.menu.loading = loading

      try {
        this.menu.projects = await apiService({
          serviceName,
          action: api.list,
          params: { ...this.menu.query, ...params }
        })

        if (!this.menu.isShowSearch) this.menu.isShowSearch = this.menu.projects.count > 9
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on get projects in getMenuProjects action.\nError: ', error)
      }

      this.menu.loading = false
    },

    async getProjects({ loading, params, initial } = { loading: true, params: {}, initial: false }) {
      if (loading) this.loading = true

      try {
        const data = await apiService({
          serviceName,
          action: api.list,
          params: { ...params }
        })

        this.projects = initial ? data : { ...data, results: [...this.projects.results, ...data.results] }
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on get workspaces in getWorkspaces action.\nError: ', error)
      }

      this.loading = false
    }
  }
})