import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const serviceName = PROJECT_STORE
const api = apiStringify(WORKSPACE_STORE)

export const useWorkspaceProjectsStore = defineStore('workspaceProjects', {
  state: () => {
    return {
      loading: true,
      projects: {
        count: 0,
        next: '',
        previous: '',
        results: []
      }
    }
  },

  actions: {
    async getWorkpaceProjects(
      { loading, params, initial, suuid: workspace_suuid } = { loading: true, params: {}, initial: false, suuid: '' }
    ) {
      if (loading) this.loading = true

      try {
        const data = await apiService({
          serviceName,
          action: api.list,
          params: { ...params, workspace_suuid }
        })

        this.projects = initial ? data : { ...data, results: [...this.projects.results, ...data.results] }
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load projects in getWorkpaceProjects action.\nError: ', error)
      }

      this.loading = false
    },

    setWorkspacePprojects({ count, results, next }) {
      this.projects = {
        next,
        count,
        results: [...this.projects.results, ...results]
      }
    },

    deleteWorkspaceProject(projectToDelete) {
      const results = this.projects.results.filter(project => project.suuid !== projectToDelete.suuid)
      this.projects = {
        ...this.projects,
        results,
        count: this.projects.count - 1
      }
    }
  }
})
