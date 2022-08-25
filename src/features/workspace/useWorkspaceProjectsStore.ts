import { defineStore } from 'pinia'
import { WORKSPACE_STORE } from './types'
import apiService from '@/core/services/apiService'
import { useWorkspaceStore } from './useWorkspaceStore'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'
import useSortFilterHelper from '@/core/composition/useSortFilterHelper'

const serviceName = WORKSPACE_STORE
const api = apiStringify(WORKSPACE_STORE)
const sortFilterHelper = useSortFilterHelper()

export const useWorkspaceProjectsStore = defineStore('workspaceProjects', {
  state: () => {
    return {
      loading: false,
      allWorkspaceProjects: {
        count: 0,
        next: '',
        previous: '',
        results: []
      }
    }
  },
  getters: {
    getProjectsByParams: state => {
      return ({ sort = 'desc', sortby = 'created', is_member, search, visibility }) => {
        sortFilterHelper.results = [...state.allWorkspaceProjects.results]

        return sortFilterHelper
          .filterByVisibility(visibility)
          .filterByMember(is_member)
          .filterBySearchtext(search)
          .sorting({ sort, sortby })
      }
    }
  },

  actions: {
    async getInitialWorkpaceProjects(data) {
      this.loading = true

      await this.getWorkpaceProjects({ ...data, initial: true })

      this.loading = false
    },

    async getWorkpaceProjects({ workspaceId, params, initial }) {
      const logger = useLogger()
      const workspaceStore = useWorkspaceStore()

      let projects
      try {
        projects = await apiService({
          params,
          serviceName,
          action: api.projects,
          uuid: workspaceStore.workspace.short_uuid || workspaceId
        })
      } catch (error) {
        logger.error('Error on load projects in getWorkpaceProjects action.\nError: ', error)

        return
      }

      // TODO check if it make sense
      if (initial) {
        const { count, results, next } = projects
        this.allWorkspaceProjects = {
          next,
          count,
          results: [...results]
        }
      } else {
        const { count, results, next, previous } = projects
        this.allWorkspaceProjects = {
          next,
          count,
          previous,
          results: [...this.allWorkspaceProjects.results, ...results]
        }
      }

      // @TODO:1 refactore loading after create project
      setTimeout(() => (this.loading = false), 1000)
    },

    setWorkspacePprojects({ count, results, next }) {
      this.allWorkspaceProjects = {
        next,
        count,
        results: [...this.allWorkspaceProjects.results, ...results]
      }
    },

    deleteWorkspaceProject(projectToDelete) {
      const results = this.allWorkspaceProjects.results.filter(
        project => project.short_uuid !== projectToDelete.short_uuid
      )
      this.allWorkspaceProjects = {
        ...this.allWorkspaceProjects,
        results,
        count: this.allWorkspaceProjects.count - 1
      }
    }
  }
})
