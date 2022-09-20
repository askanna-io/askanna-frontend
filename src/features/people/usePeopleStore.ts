import { defineStore } from 'pinia'
import { set, get, map } from 'lodash'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'
import { PEOPLE_STORE, PersonModel, WORKSPACE_STORE, InvitationModel } from './types'

const serviceName = WORKSPACE_STORE
const api = apiStringify(WORKSPACE_STORE)

export const usePeopleStore = defineStore(PEOPLE_STORE, {
  state: () => {
    return {
      loading: false,
      people: [],
      peopleParams: {
        search: '',
        sorting: {
          sortBy: 'name',
          sort: 1
        },
        filter: {
          role: '',
          status: ''
        }
      },
      currentPeople: new PersonModel().state,
      invitation: new InvitationModel().state
    }
  },
  getters: {
    currentPeoplePermission: state => state.currentPeople.permission
  },

  actions: {
    async setParams({ path, value }) {
      set(this, path, value)
    },

    async getPeople({ workspaceId }) {
      this.loading = true

      let people = []
      try {
        people = await apiService({
          serviceName,
          uuid: workspaceId,
          action: api.getPeople
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load people in getPeople action.\nError: ', error)

        return
      }

      this.people = people
      this.loading = false
    },

    async sendInvitations({ emails, role }) {
      const logger = useLogger()
      const workspaceStore = useWorkspaceStore()

      const result = await Promise.all(
        map(emails, async email => {
          const people = await this.sendInviteEmail({
            role,
            email,
            front_end_url: window.location.origin,
            object_uuid: workspaceStore.workspace.uuid
          })
          if (people.short_uuid && people) {
            return people
          }

          return { email: '', name: '' }
        })
      )
      const people = result.filter(item => item.email !== '')

      if (people.length) {
        this.people = [...this.people, ...people]

        logger.success(
          `You have successfully invited ${people.map(item => item.email).join(', ')} to join the workspace
        ${workspaceStore.workspace.name}`
        )
      }
    },

    async resendInvitation(uuid) {
      const logger = useLogger()
      const workspaceStore = useWorkspaceStore()

      let response

      const data = {
        status: 'invited'
      }
      try {
        response = await apiService({
          data,
          uuid,
          serviceName,
          method: 'PATCH',
          action: api.acceptInvitetion
        })
      } catch (e) {
        logger.error('Error on resent invatation in resendInvitation action.\nError: ', e)

        return e
      }

      if (response) {
        logger.success(
          `You have successfully re-invited ${response.email} to join the workspace
        ${workspaceStore.workspace.name}`
        )
      }
    },

    async deleteInvitation(people) {
      const logger = useLogger()

      try {
        await apiService({
          action: api.acceptInvitetion,
          method: 'DELETE',
          uuid: {
            peopleId: people.short_uuid,
            workspaceId: people.workspace.short_uuid
          },
          serviceName
        })
      } catch (e) {
        logger.error('Error on delete invatation in deleteInvitation action.\nError: ', e)

        return e
      }
      this.people.splice(this.people.indexOf(people), 1)

      logger.success(
        `You have successfully deleted the invitation for ${people.name} on the workspace
        ${people.workspace.name}`
      )
    },

    async sendInviteEmail(data) {
      const logger = useLogger()
      const workspaceStore = useWorkspaceStore()

      let response
      try {
        response = await apiService({
          data,
          serviceName,
          method: 'post',
          action: api.invitePeople,
          uuid: workspaceStore.workspace.short_uuid
        })
      } catch (e) {
        logger.error('Error on upload package in registerPackage action.\nError: ', e)

        return e
      }

      return response
    },

    async acceptInvitetion({ token, peopleId, workspaceId }: { token: string; peopleId: string; workspaceId: string }) {
      let response

      const data = {
        status: 'accepted',
        token
      }
      try {
        response = await apiService({
          data,
          serviceName,
          method: 'PATCH',
          action: api.acceptInvitetion,
          uuid: { workspaceId, peopleId }
        })
      } catch (e) {
        return e
      }

      return response
    },

    async changeRole({ role, peopleId, workspaceId }) {
      const logger = useLogger()

      let people

      const data = {
        role
      }
      try {
        people = await apiService({
          data,
          serviceName,
          method: 'PATCH',
          action: api.acceptInvitetion,
          uuid: { workspaceId, peopleId }
        })
      } catch (e) {
        logger.error('Error on change people Role in changeRole action.\nError: ', e)

        return e
      }
      logger.success(
        `You have successfully changed the role of ${people.name} for the workspace ${people.workspace.name}.`
      )

      this.people.splice(this.people.map(item => item.short_uuid).indexOf(people.short_uuid), 1, people)

      return people
    },

    async updateWorkspaceProfile(data) {
      let people
      const workspaceStore = useWorkspaceStore()

      try {
        people = await apiService({
          data,
          serviceName,
          method: 'PATCH',
          action: api.profile,
          uuid: workspaceStore.workspace.short_uuid
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on change people in updateWorkspaceProfile action.\nError: ', e)

        return e
      }

      this.currentPeople = {
        ...this.currentPeople,
        ...people,
        permission: {
          ...this.currentPeople.permission,
          ...people.permission
        }
      }

      this.people.splice(this.people.map(people => people.short_uuid).indexOf(people.short_uuid), 1, people)

      return people
    },

    async getInvitetionInfo({ token, peopleId, workspaceId }) {
      let response

      try {
        response = await apiService({
          serviceName,
          params: { token },
          action: api.acceptInvitetion,
          uuid: { workspaceId, peopleId }
        })
      } catch (e) {
        const logger = useLogger()

        const message = get(e, 'response.data.token') || 'Your token is not valid.\nError: '
        logger.error(message, e)

        this.invitation = new InvitationModel().state

        return
      }

      this.invitation = response
    },

    async deletePeople(people) {
      const logger = useLogger()

      try {
        await apiService({
          serviceName,
          method: 'DELETE',
          action: api.acceptInvitetion,
          uuid: { workspaceId: people.workspace.short_uuid, peopleId: people.short_uuid }
        })
      } catch (e) {
        logger.error('Error on delete people in deletePeople action.\nError: ', e)

        return e
      }

      // @TODO check this logic
      this.people.splice(this.people.indexOf(people), 1)

      logger.success(
        `You have successfully deleted ${people.name} from the workspace
      ${people.workspace.name}`
      )
    },

    async setCurretPeople(data) {
      this.currentPeople = {
        ...this.currentPeople,
        ...data,
        permission: {
          ...this.currentPeople.permission,
          ...data.permission
        }
      }
    },

    async getCurrentPeople({ workspaceId }) {
      const workspaceStore = useWorkspaceStore()

      let people

      try {
        people = await apiService({
          serviceName,
          action: api.profile,
          uuid: workspaceId || workspaceStore.workspace.short_uuid
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on get people in getCurrentPeople action.\nError: ', e)

        return e
      }

      this.currentPeople = {
        ...this.currentPeople,
        ...people,
        permission: {
          ...this.currentPeople.permission,
          ...people.permission
        }
      }
      const userStore = useUserStore()

      const name = people.name || people.membership.name || userStore.globalProfile.name

      if (people && import.meta.env.VITE_APP_INTERCOM === 'on') {
        window.Intercom('boot', {
          app_id: 'c6wuieqm',
          name: name,
          email: people.email,
          user_id: people.membership?.user?.short_uuid,
          created_at: userStore.userProfile?.date_joined
        })
      }
    },

    async setPeopleAvatar(data) {
      const workspaceStore = useWorkspaceStore()

      let result

      try {
        result = await apiService({
          data,
          serviceName,
          method: 'PATCH',
          action: api.profileAvatar,
          uuid: workspaceStore.workspace.short_uuid
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on update people avatar in setPeopleAvatar action.\nError: ', e)

        return e
      }

      return result
    }
  }
})
