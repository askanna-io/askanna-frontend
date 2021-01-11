export interface AuthState extends authData {}

export interface authData {
  userId: string
  userRole: string
  authToken: string
  refreshToken: string
  tokenExpires: string
}

export const authStoreName = 'auth'

export const mt = {
  SET_AUTH: 'SET_AUTH',
  DROP_AUTH: 'DROP_AUTH',
  SET_USER_PROFILE: 'SET_USER_PROFILE'
}

export const ac = {
  login: 'login',
  logout: 'logout',
  getAccounts: 'getAccounts',
  createAccount: 'createAccount',
  resetPassword: 'resetPassword',
  getCurrentUser: 'getCurrentUser',
  acceptInvatation: 'acceptInvatation',
  validateResetToken: 'validateResetToken',
  confirmResetPassword: 'confirmResetPassword'
}
