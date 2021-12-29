import { defineStore } from 'pinia'

export const useMobileStore = defineStore('mobile', {
  state: () => {
    return {
      isMenuOpen: false,
      isMenuSticked: false
    }
  }
})
