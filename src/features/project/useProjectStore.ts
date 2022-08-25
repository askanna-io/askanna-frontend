import { set } from 'lodash'
import router from '@/core/router'
import VueRouter from 'vue-router'
import { defineStore } from 'pinia'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'
import { useGeneralStore } from '@/core/store/useGeneralStore'
const { isNavigationFailure, NavigationFailureType } = VueRouter
import { usePeopleStore } from '@/features/people/usePeopleStore'
import { PROJECT_STORE, ProjectModel, ProjectVisibility } from './types'
import { useWorkspaceProjectsStore } from '@/features/workspace/useWorkspaceProjectsStore'

const serviceName = PROJECT_STORE
const api = apiStringify(serviceName)

export const useProjectStore = defineStore(PROJECT_STORE, {
  state: () => {
    return {
      project: new ProjectModel().state,
      projects: {
        count: 0,
        next: '',
        previous: '',
        results: []
      },
      projectJobs: [],
      query: {
        limit: 1000,
        offset: 0
      },
      jobsLoading: true,
      lastPackage: {
        short_uuid: ''
      },
      menu: {
        sticked: false,
        isSticked: true,
        isShowProjectBar: false
      },
      projectLoading: true,
      projectsLoading: true,
      projectTemplates: [
        {
          created: '',
          deleted: null,
          modified: '',
          name: 'Blank project (no template used)',
          scope: null,
          short_uuid: '',
          template_location: '',
          uuid: ''
        }
      ]
    }
  },

  actions: {
    async getProject(uuid) {
      this.projectLoading = true

      let project
      try {
        project = await apiService({
          uuid: uuid,
          serviceName,
          action: api.get
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load project in getProject action.\nError: ', error)

        project = new ProjectModel().state

        router.push({ name: 'project-does-not-exist' }).catch(failure => {
          if (isNavigationFailure(failure, NavigationFailureType.redirected)) {
            logger.error('Error on redirect to workspace-project-does-not-exist.\nError: ', failure)
          }
        })

        return
      }

      this.project = project

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ projectId: project.name, workspaceId: project.workspace.name })

      this.projectLoading = false

      return project
    },

    async getProjectMe(uuid) {
      let projectMe
      try {
        projectMe = await apiService({
          uuid,
          serviceName,
          action: api.projectMe
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load projects in getProjects action.\nError: ', error)

        return
      }

      const peopleStore = usePeopleStore()
      peopleStore.setCurretPeople({ permission: projectMe.permission })
    },

    async getProjects() {
      let projects

      try {
        projects = await apiService({
          serviceName,
          action: api.list,
          params: this.query
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load projects in getProjects action.\nError: ', error)

        return
      }

      this.projects = projects
    },

    resetProjectJobs() {
      this.projectJobs = []
    },

    async getLastPackage(uuid) {
      let packages
      let packageData = { short_uuid: '' }

      try {
        packages = await apiService({
          uuid,
          serviceName,
          params: {
            limit: 1,
            offset: 0
          },
          action: api.packages
        })
        packageData = packages && packages.results && packages.results ? packages.results[0] : null
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on load packageData in getLastPackage action.\nError: ', e)

        return
      }

      this.lastPackage = packageData
    },

    async setMenu(data) {
      const { name = 'menu.isShowProjectBar', value } = data
      set(this, name, value)
    },

    async createProjectShortWay(workspace) {
      const data = {
        workspace,
        name: this.project.name,
        visibility: ProjectVisibility.PRIVATE
      }

      await this.createProject(data)
    },

    async createProjectFullWay(workspace) {
      const data = {
        ...this.project,
        workspace
      }
      const project = await this.createProject(data)

      return project
    },

    async createProject(data) {
      const logger = useLogger()

      let project
      try {
        project = await apiService({
          data,
          serviceName,
          method: 'post',
          action: api.create
        })
      } catch (error) {
        logger.error('Error on create project in createProject action.\nError:', error)

        return project
      }

      this.projects = {
        next: this.projects.next,
        count: this.projects.count + 1,
        previous: this.projects.previous,
        results: this.projects.results.concat(project)
      }

      const workspaceProjectsStore = useWorkspaceProjectsStore()
      await workspaceProjectsStore.setWorkspacePprojects({ results: [{ ...project, lastPackage: { short_uuid: '' } }] })

      logger.success(`The project ${project.name} is created`)

      return project
    },

    async updateProject(data) {
      const logger = useLogger()

      let project
      try {
        project = await apiService({
          data,
          serviceName,
          method: 'put',
          action: api.update,
          uuid: this.project.short_uuid
        })
      } catch (error) {
        logger.error('Error on update project in updateProject action.\nError: ', error as Error)

        return project
      }

      this.project = project

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ projectId: project.name })

      return project
    },

    setProject(data) {
      const { path, value } = data

      set(this, `project.${path}`, value)
    },

    resetProjectData() {
      this.project = new ProjectModel().state
    },

    async getProjectTemplates() {
      let projectTemplates

      try {
        projectTemplates = await apiService({
          serviceName,
          action: api.templates
        })
      } catch (error) {
        return
      }

      this.projectTemplates = [...this.projectTemplates, ...projectTemplates]
    },

    async deleteProject(project) {
      const logger = useLogger()

      try {
        await apiService({
          serviceName,
          method: 'delete',
          action: api.delete,
          uuid: project.short_uuid
        })
      } catch (error) {
        logger.error('Error on delete project in deleteProject action.\nError: ', error)

        return
      }

      const workspaceProjectsStore = useWorkspaceProjectsStore()
      workspaceProjectsStore.deleteWorkspaceProject(project)

      logger.success(`You have successfully deleted the project ${project.name}`)
    }
  }
})
