import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', {
  state: () => {
    return {
      url: '',
      isMenuOpen: false
    }
  }
})
