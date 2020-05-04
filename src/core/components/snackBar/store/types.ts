export interface SnackbarState {
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

export const snackbarStoreName = 'snackbar'

export const ac = {
  showSnackBar: 'showSnackBar',
  closeSnackBar: 'closeSnackBar'
}
export const mt = {
  SET_SNACKBAR: 'SET_SNACKBAR',
  CLOSE_SNACKBAR: 'CLOSE_SNACKBAR'
}
export const TIMINGS = {
  SNACKBAR_SYMBOL_READ_TIME: 300
}
