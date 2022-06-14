import { defineStore } from 'pinia'
const SNACKBAR_SYMBOL_READ_TIME = 300

interface Snackbar {
  top?: boolean
  color?: string
  left?: boolean
  open?: boolean
  right?: boolean
  bottom?: boolean
  timeout?: number
  message?: string
  multiLine?: boolean
}

export const useSnackBar = defineStore('snackbar', {
  state: () => {
    return {
      snackbar: {
        open: false,
        color: '',
        message: '',
        timeout: 6000,
        top: true,
        right: true,
        left: false,
        bottom: false,
        multiLine: true
      }
    }
  },
  actions: {
    async showSnackBar(params: Snackbar) {
      const { message = '', timeout = message.length * SNACKBAR_SYMBOL_READ_TIME } = params

      this.snackbar = {
        ...this.snackbar,
        ...params,
        ...{
          timeout,
          open: true
        }
      }
    },
    async closeSnackBar() {
      this.snackbar.open = false
    }
  }
})
