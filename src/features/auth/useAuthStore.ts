import { defineStore } from 'pinia'
import * as Sentry from '@sentry/browser'
import apiService from '@/services/apiService'
import { apiStringify } from '@/services/api-settings'

const apiAccounts = apiStringify('accounts')

const serviceName = 'auth'
const api = apiStringify(serviceName)

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      signUpStep: 0,
      userId: '',
      userRole: '',
      refreshToken: '',
      tokenExpires: '',
      authData: { email: '', password: '' },
      authToken: window.localStorage.getItem('token')
    }
  },

  getters: {
    isUserLoggedIn: state => !!state.authToken
  },

  actions: {
    async login({ email, password }: { email: string; password: string }) {
      try {
        const result = await apiService({
          serviceName,
          method: 'post',
          action: api.login,
          data: { email, password }
        })

        this.userId = result.userId
        this.authToken = result.key
        localStorage.setItem('token', result.key)

        const userStore = useUserStore()
        userStore.tempAuth = { email, password }

        return result
      } catch (error: any) {
        const logger = useLogger()

        logger.error('Error on login action.\nError: ', error)

        if (error?.response?.data?.non_field_errors) {
          logger.userDanger(error?.response?.data?.non_field_errors[0])
        }

        return error
      }
    },

    async logout() {
      try {
        await apiService({
          serviceName,
          method: 'post',
          action: api.logout
        })
      } catch (error: any) {
        const logger = useLogger()

        logger.error('Error on logout action.\nError: ', error)
      }

      this.userId = ''
      this.authToken = ''
      this.refreshToken = ''
      this.tokenExpires = ''
      localStorage.setItem('token', '')
      localStorage.setItem('back_after_login', '')

      if (import.meta.env.VITE_APP_SENTRY_URL) {
        Sentry.configureScope(scope => scope.setUser(null))
      }
    },

    async createAccount(data) {
      let response
      try {
        response = await apiService({
          action: apiAccounts.create,
          method: 'post',
          serviceName: 'accounts',
          data
        })
      } catch (e: any) {
        const logger = useLogger()

        logger.error('Error on create account in createAccount action.\nError: ', e)

        return e
      }

      return response
    },

    async resetPassword(data) {
      try {
        const result = await apiService({
          data,
          serviceName,
          method: 'post',
          action: api.resetPassword
        })

        return result
      } catch (error: any) {
        const logger = useLogger()

        logger.error('Error on resetPassword action.\nError: ', error)

        return error
      }
    },

    async confirmResetPassword(data) {
      const logger = useLogger()

      try {
        const result = await apiService({
          data,
          serviceName,
          method: 'post',
          action: api.confirmResetPassword
        })

        logger.success(`Your password has been reset successfully!`)

        return result
      } catch (error: any) {
        logger.error('Error on confirmResetPassword action.\nError: ', error)

        return error
      }
    },

    async resetTokenStatus(params) {
      let result

      try {
        result = await apiService({
          params,
          serviceName,
          action: api.resetTokenStatus
        })
      } catch (error: any) {
        const logger = useLogger()

        logger.error('Error on resetTokenStatus action.\nError: ', error)

        return error
      }

      return result
    }
  }
})