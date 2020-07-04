export interface UploadStatusState {
  uploads: any[]
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

export const snackbarStoreName = 'uploadStatus'

export const ac = {
  addUpload: 'addUpload',
  setUpload: 'setUpload',
  showSnackBar: 'showSnackBar',
  clearSnackBar: 'clearSnackBar',
  closeSnackBar: 'closeSnackBar',
  showHideSnackBar: 'showHideSnackBar'
}
export const mt = {
  ADD_UPLOAD: 'ADD_UPLOAD',
  SET_UPLOAD: 'SET_UPLOAD',
  CLEAR_UPLOAD: 'CLEAR_UPLOAD',
  SET_SNACKBAR: 'SET_SNACKBAR',
  CLOSE_SNACKBAR: 'CLOSE_SNACKBAR'
}
export const TIMINGS = {
  SNACKBAR_SYMBOL_READ_TIME: 300
}
