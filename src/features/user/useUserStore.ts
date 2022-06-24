import { defineStore } from 'pinia'

export const useUserStoreP = defineStore('user', {
  state: () => {
    return {
      tempAuth: {
        username: '',
        password: ''
      }
    }
  }
})
