export interface AuthState extends authData {}

export interface authData {
  userId: string
  userRole: string
  authToken: string
  refreshToken: string
  tokenExpires: string
}

export const authStoreName = 'auth'
