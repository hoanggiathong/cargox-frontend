import type { LoginPayload, LoginResponse } from '~/types/auth'
import { createApiClient } from './api'

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const api = createApiClient()
    const response = await api.post<LoginResponse>('/auth/login', payload)
    return response.data
  },

  async me(): Promise<LoginResponse['user']> {
    const api = createApiClient()
    const response = await api.get<LoginResponse['user']>('/auth/me')
    return response.data
  },
}