import { defineStore } from 'pinia'
import * as Sentry from '@sentry/browser'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const serviceName = 'user'
const apiActions = apiStringify('user')

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      accounts: [],
      userProfile: {
        name: '',
        email: '',
        suuid: '',
        date_joined: '',
        password: undefined
      },
      globalProfile: {
        suuid: '',
        name: '',
        email: '',
        job_title: '',
        role: {
          name: '',
          code: ''
        },
        avatar: {
          icon: '',
          small: '',
          medium: '',
          large: ''
        },
        permission: undefined
      },
      tempAuth: {
        email: '',
        password: ''
      }
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.globalProfile.suuid,
    globalPermission: (state) => state.globalProfile.permission
  },

  actions: {
    async getUserProfile() {
      let result
      try {
        result = await apiService({
          serviceName,
          action: apiActions.getProfile
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on get current user profile in getUserProfile action.\nError: ', e)

        return e
      }
      if (!result) {
        return
      }

      this.userProfile = result

      if (import.meta.env.VITE_APP_SENTRY_URL) {
        const { email, suuid: id } = result
        Sentry.setUser({ id, email, username: email })
      }

      return result
    },

    async updateProfile({ suuid, data }) {
      let user
      try {
        user = await apiService({
          method: 'PATCH',
          suuid,
          data,
          action: apiActions.updateAccount,
          serviceName
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on update user profile in updateProfile action.\nError: ', error)

        return error
      }

      this.userProfile = user

      return user
    },

    async getAccounts() {
      let accounts
      try {
        accounts = await apiService({
          action: apiActions.getAccounts,
          serviceName
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on get getAccounts in getAccounts action.\nError: ', error)

        return error
      }

      this.accounts = accounts

      return accounts
    },

    async getGlobalProfile() {
      let profile
      try {
        profile = await apiService({
          serviceName,
          action: apiActions.globalProfile
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on get global profile in getGlobalProfile action.\nError: ', error)

        return error
      }

      this.globalProfile = profile
    },

    async updateGlobalProfile(data) {
      let profile
      try {
        profile = await apiService({
          data,
          serviceName,
          method: 'PATCH',
          action: apiActions.globalProfile
        })
      } catch (error) {
        const logger = useLogger()

        logger.error('Error on update global profile in updateGlobalProfile action.\nError: ', error)

        return error
      }

      this.globalProfile = profile

      return profile
    },

    async updateGlobalAvatar(data) {
      let result

      try {
        result = await apiService({
          data,
          serviceName,
          method: 'PUT',
          returnFullResponse: true,
          action: apiActions.globalProfileAvatar
        })
      } catch (e) {
        const logger = useLogger()

        logger.error('Error on update global avatar in updateGlobalAvatar action.\nError: ', e)

        return e
      }

      return result
    }
  }
})
