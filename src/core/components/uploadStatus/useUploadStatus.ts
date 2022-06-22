import { defineStore } from 'pinia'

interface UploadParams {
  id: string
  name?: string
  message?: string
  progress: number
  projectId: string
  packageId: string
  isComplete: Boolean
}

export const useUploadStatus = defineStore('upload-status', {
  state: () => {
    return {
      uploads: [] as UploadParams[],
      snackbar: {
        open: false,
        color: 'primary',
        message: '',
        timeout: -1,
        top: false,
        right: true,
        left: false,
        bottom: true,
        multiLine: true
      }
    }
  },
  getters: {
    colorStatus: state => (state.snackbar.open ? 'white' : 'grey'),

    totalProcess: state => {
      const reducer = (acc: number, cr: any) => {
        if (cr.isComplete) return acc
        acc = acc + 1

        return acc
      }

      const count = state.uploads.reduce(reducer, 0)

      return count || 0
    },

    iconStatus() {
      const reducer = (acc: number, cr: any) => {
        if (cr.isComplete) return acc
        acc = acc + cr.progress

        return acc
      }
      const allProgress = this.uploads.reduce(reducer, 0)
      if (allProgress === 0) return 'mdi-circle-slice-8'

      const calcProgress = (allProgress * 100) / (Number(this.totalProcess) * 100) / Number(this.totalProcess)

      switch (true) {
        case calcProgress <= 12.5:
          return 'mdi-circle-slice-1'

        case calcProgress <= 25:
          return 'mdi-circle-slice-2'

        case calcProgress <= 37.5:
          return 'mdi-circle-slice-3'

        case calcProgress <= 50:
          return 'mdi-circle-slice-4'

        case calcProgress <= 62.5:
          return 'mdi-circle-slice-5'

        case calcProgress <= 75:
          return 'mdi-circle-slice-6'

        case calcProgress <= 87.5:
          return 'mdi-circle-slice-7'

        case calcProgress <= 100:
          return 'mdi-circle-slice-8'

        default:
          return 'mdi-timelapse'
      }
    }
  },
  actions: {
    showHideSnackBar() {
      const message = this.uploads.length ? '' : "You don't have tasks yet."

      this.snackbar.message = message
      this.snackbar.open = !this.snackbar.open
    },
    closeSnackBar() {
      this.snackbar.message = ''
      this.snackbar.open = false
    },
    addUpload(data: UploadParams) {
      this.snackbar.message = ''

      const item = {
        ...data,
        ...this.snackbar
      }

      this.uploads.push(item)
    },
    setUpload(data: UploadParams) {
      const index = this.uploads.findIndex(item => item.id === data.id)
      const item = this.uploads[index]

      this.uploads.splice(index, 1, { ...item, ...data, message: '' })
    },
    clearSnackBar() {
      this.uploads = []
      this.snackbar.message = "You don't have tasks yet."
    }
  }
})
