export type UserRole = 'ADMIN' | 'CUSTOMER' | 'CARRIER' | 'DRIVER'

export interface AuthUser {
  _id: string
  fullName: string
  phone: string
  email?: string
  role: UserRole
  status: 'ACTIVE' | 'LOCKED'
}

export interface LoginPayload {
  phone: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}