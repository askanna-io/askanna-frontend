import axios from 'axios'
import router from '@/core/router'
import { defineStore } from 'pinia'
import * as Sentry from '@sentry/browser'
import { api } from '@/core/services/api-settings'
import apiService from '@/core/services/apiService'
import { useLogger } from '@/core/composition/useLogger'
import { apiStringify } from '@/core/services/api-settings'
import { useUserStore } from '@/features/user/useUserStore'

const apiAccounts = apiStringify('accounts')

const serviceName = 'auth'
const api = apiStringify(serviceName)

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      userId: '',
      userRole: '',
      refreshToken: '',
      tokenExpires: '',
      authToken: window.localStorage.getItem('token')
    }
  },

  getters: {
    isUserLoggedIn: state => !!state.authToken
  },

  actions: {
    async login({ username, password, redirect = true }: { username: string; password: string; redirect?: boolean }) {
      try {
        const result = await apiService({
          serviceName,
          method: 'post',
          action: api.login,
          data: { username, password }
        })

        this.userId = result.userId
        this.authToken = result.key
        localStorage.setItem('token', result.key)

        const userStore = useUserStore()
        userStore.tempAuth = { username, password }

        if (redirect) router.push({ name: 'check-access' })

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

    async logout(redirect = true) {
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

      if (process.env.VUE_APP_SENTRY === 'on') {
        Sentry.configureScope(scope => scope.setUser(null))
      }

      if (redirect) router.push({ path: '/signin' })
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

    async validateResetToken(params) {
      let result

      try {
        result = await apiService({
          params,
          serviceName,
          action: api.validateResetToken
        })
      } catch (error: any) {
        const logger = useLogger()

        logger.error('Error on validateResetToken action.\nError: ', error)

        return error
      }

      return result
    }
  }
})
