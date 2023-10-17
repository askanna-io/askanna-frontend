import { set } from 'lodash'
import { defineStore } from 'pinia'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'
import { PROJECT_STORE, ProjectModel, ProjectVisibility } from './types'

const serviceName = PROJECT_STORE
const api = apiStringify(serviceName)

export const useProjectStore = defineStore(PROJECT_STORE, {
  state: () => {
    return {
      project: new ProjectModel().state,
      form: {
        name: '',
        description: '',
        visibility: ProjectVisibility.PRIVATE
      },
      menu: {
        sticked: false,
        isSticked: true,
      },
      projectLoading: true,
    }
  },

  actions: {
    async getProject(suuid) {
      this.projectLoading = true

      let project
      try {
        project = await apiService({
          suuid,
          serviceName,
          action: api.get
        })
      } catch (error) {
        const logger = useLogger()
        const generalStore = useGeneralStore()

        logger.error('Error on load project in getProject action.\nError: ', error)

        project = new ProjectModel().state

        await generalStore.setRouteNotExist()

        return
      }

      this.project = project

      this.form = {
        name: project.name,
        visibility: project.visibility,
        description: project.description
      }

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ projectName: project.name, workspaceName: project.workspace.name })

      this.projectLoading = false

      return project
    },

    async getProjectMe(suuid) {
      let projectMe
      try {
        projectMe = await apiService({
          suuid,
          serviceName,
          action: api.projectMe
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load projectMe in getProjectMe action.\nError: ', error)

        return
      }

      const peopleStore = usePeopleStore()
      peopleStore.setCurretPeople({ permission: projectMe.permission })
    },

    resetProjectJobs() {
      this.projectJobs = []
    },

    async createProjectShortWay(workspace_suuid) {
      const data = {
        workspace_suuid,
        name: this.project.name,
        visibility: ProjectVisibility.PRIVATE
      }

      return await this.createProject(data)
    },

    async createProjectFullWay(workspace_suuid) {
      const data = {
        ...this.project,
        workspace_suuid
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

      const workspaceProjectsStore = useWorkspaceProjectsStore()
      await workspaceProjectsStore.setWorkspacePprojects({ results: [{ ...project, lastPackage: { suuid: '' } }] })

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
          method: 'PATCH',
          action: api.update,
          suuid: this.project.suuid
        })
      } catch (error) {
        logger.error('Error on update project in updateProject action.\nError: ', error as Error)

        return project
      }

      this.project = project

      const generalStore = useGeneralStore()
      generalStore.setBreadcrumbParams({ projectName: project.name })

      return project
    },

    setProject(data) {
      const { path, value } = data

      set(this, `project.${path}`, value)
    },

    resetProjectData() {
      this.project = new ProjectModel().state
    },

    async deleteProject(project) {
      const logger = useLogger()

      try {
        await apiService({
          serviceName,
          method: 'delete',
          action: api.delete,
          suuid: project.suuid
        })
      } catch (error) {
        logger.error('Error on delete project in deleteProject action.\nError: ', error)

        return
      }

      const workspaceProjectsStore = useWorkspaceProjectsStore()
      workspaceProjectsStore.deleteWorkspaceProject(project)

      logger.success(`You have successfully deleted the project ${project.name}`)
    },

    async resetForm() {
      this.form = {
        name: this.project.name,
        visibility: this.project.visibility,
        description: this.project.description
      }
    }
  }
})
