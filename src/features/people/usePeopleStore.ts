import { defineStore } from 'pinia'
import { set, get, map } from 'lodash'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'
import { PEOPLE_STORE, PersonModel, InvitationModel } from './types'

const serviceName = WORKSPACE_STORE
const api = apiStringify(WORKSPACE_STORE)

export const usePeopleStore = defineStore(PEOPLE_STORE, {
  state: () => {
    return {
      loading: true,
      people: {
        count: 0,
        next: '',
        previous: '',
        results: []
      },
      currentPeople: new PersonModel().state,
      invitation: new InvitationModel().state
    }
  },
  getters: {
    currentPeoplePermission: (state) => state.currentPeople.permission
  },

  actions: {
    async setParams({ path, value }) {
      set(this, path, value)
    },

    async getPeople({ loading, params, initial, suuid } = { loading: true, params: {}, initial: false, suuid: '' }) {
      if (loading) this.loading = true

      try {
        const data = await apiService({
          params,
          suuid,
          serviceName,
          action: api.getPeople
        })
        this.people = initial ? data : { ...data, results: [...this.people.results, ...data.results] }
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on load people in getPeople action.\nError: ', error)
      }

      this.loading = false
    },

    async checkPeopleByEmails({ suuid, emails } = { suuid: '', emails: [] as string[] }) {
      try {
        const data = await apiService({
          suuid,
          serviceName,
          action: api.checkPeopleByEmails,
          params: { email: emails.join(',') }
        })

        return data?.email_exist || []
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on check people by emails in checkPeopleByEmails action.\nError: ', error)
      }
    },

    async sendInvitations({ emails, role_code, params }) {
      const logger = useLogger()
      const workspaceStore = useWorkspaceStore()

      const result = await Promise.all(
        map(emails, async (email) => {
          const people = await this.sendInviteEmail({
            email,
            role_code,
            front_end_url: window.location.origin,
            workspace: workspaceStore.workspace.suuid
          })
          if (people.suuid && people) {
            return people
          }

          return { email: '', name: '' }
        })
      )
      const people = result.filter((item) => item.email !== '')

      if (people.length) {
        await this.getPeople({ params, initial: true, suuid: workspaceStore.workspace.suuid })

        logger.success(
          `You have successfully invited ${people.map((item) => item.email).join(', ')} to join the workspace
        ${workspaceStore.workspace.name}`
        )
      }
    },

    async resendInvitation(suuid) {
      const logger = useLogger()
      const workspaceStore = useWorkspaceStore()

      let response

      const data = {
        status: 'invited'
      }
      try {
        response = await apiService({
          data,
          suuid,
          serviceName,
          method: 'POST',
          action: api.resendInvitetion
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

    async deleteInvitation({ people, params }) {
      const logger = useLogger()
      const workspaceStore = useWorkspaceStore()

      try {
        await apiService({
          method: 'DELETE',
          action: api.updatePeople,
          suuid: {
            peopleId: people.suuid,
            workspaceId: people.workspace.suuid
          },
          serviceName
        })
      } catch (e) {
        logger.error('Error on delete invatation in deleteInvitation action.\nError: ', e)

        return e
      }

      await this.getPeople({ params, initial: true, suuid: workspaceStore.workspace.suuid })

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
          method: 'POST',
          action: api.invitePeople,
          suuid: workspaceStore.workspace.suuid
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
        token
      }
      try {
        response = await apiService({
          data,
          serviceName,
          method: 'post',
          returnFullResponse: true,
          action: api.acceptInvitetion,
          suuid: { workspaceId, peopleId }
        })
      } catch (e) {
        return e
      }

      return response
    },

    async changeRole({ role_code, params, peopleId, workspaceId }) {
      const logger = useLogger()

      let people

      const data = {
        role_code
      }
      try {
        people = await apiService({
          data,
          serviceName,
          method: 'PATCH',
          action: api.updatePeople,
          suuid: { workspaceId, peopleId }
        })
      } catch (e) {
        logger.error('Error on change people Role in changeRole action.\nError: ', e)

        return e
      }
      logger.success(`You have successfully changed the role of ${people.name} for the workspace ${people.workspace.name}.`)

      await this.getPeople({ params, initial: true, suuid: workspaceId })

      return people?.suuid
    },

    async updateWorkspaceProfile({ data, params }) {
      let people
      const workspaceStore = useWorkspaceStore()

      try {
        people = await apiService({
          data,
          serviceName,
          method: 'PATCH',
          action: api.profile,
          suuid: workspaceStore.workspace.suuid
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

      await this.getPeople({ params, initial: true, suuid: workspaceStore.workspace.suuid })

      return people
    },

    async getInvitetionInfo({ token, peopleId, workspaceId }) {
      let response

      try {
        response = await apiService({
          serviceName,
          params: { token },
          action: api.getInvitetionInfo,
          suuid: { workspaceId, peopleId }
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

    async deletePeople({ people, params }) {
      const logger = useLogger()

      try {
        await apiService({
          serviceName,
          method: 'DELETE',
          action: api.updatePeople,
          suuid: { workspaceId: people.workspace.suuid, peopleId: people.suuid }
        })
      } catch (e) {
        logger.error('Error on delete people in deletePeople action.\nError: ', e)

        return e
      }

      await this.getPeople({ params, initial: true, suuid: people.workspace.suuid })

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

    async setCurretPeoplePermission(permission) {
      this.currentPeople = {
        ...this.currentPeople,
        permission: {
          ...this.currentPeople.permission,
          ...permission
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
          suuid: workspaceId || workspaceStore.workspace.suuid
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

      const name = people.name || userStore.globalProfile.name

      if (people && import.meta.env.VITE_APP_INTERCOM === 'on') {
        window.Intercom('boot', {
          app_id: 'c6wuieqm',
          name: name,
          email: people.email,
          user_id: people.membership?.user?.suuid,
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
          method: 'PUT',
          returnFullResponse: true,
          action: api.profileAvatar,
          suuid: workspaceStore.workspace.suuid
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
