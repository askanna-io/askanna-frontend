export interface loggerState extends LoggerState {}

export interface LoggerState {
  consoleLog: Boolean
  snackBar: Boolean
  development: Boolean
  production: Boolean
}

export const LOGGER_STORE = 'logger'

export const action = {
  success: 'success',
  authError: 'authError',
  passResetSuccess: 'passResetSuccess',
  userWarning: 'userWarning',
  userDanger: 'userDanger',
  error: 'error'
}

export const mutation = {
  SET_LOGGER: 'SET_LOGGER'
}
