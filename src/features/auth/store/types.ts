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
  DROP_AUTH: 'DROP_AUTH'
}

export const ac = {
  login: 'login',
  logout: 'logout',
  acceptInvatation: 'acceptInvatation'
}
