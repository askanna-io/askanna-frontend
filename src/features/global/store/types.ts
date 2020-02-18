export interface GlobalState {
  snackbar: Snackbar
}

export interface Snackbar {
  top: boolean
  color: string
  left: boolean
  open: boolean
  right: boolean
  bottom: boolean
  timeout: number
  message: string
  multiLine: boolean
}

export const globalStoreName = 'global'
