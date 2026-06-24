import { defineStore } from 'pinia'
import { authService } from '~/services/auth.service'
import type { AuthUser, LoginPayload } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const accessToken = ref<string | null>(process.client ? localStorage.getItem('accessToken') : null)
  const initialized = ref(false)

  const isLoggedIn = computed(() => Boolean(accessToken.value && user.value))
  const role = computed(() => user.value?.role || null)

  const setSession = (token: string, authUser: AuthUser) => {
    accessToken.value = token
    user.value = authUser

    if (process.client) {
      localStorage.setItem('accessToken', token)
    }
  }

  const clearSession = () => {
    accessToken.value = null
    user.value = null

    if (process.client) {
      localStorage.removeItem('accessToken')
    }
  }

  const login = async (payload: LoginPayload) => {
    const response = await authService.login(payload)
    setSession(response.accessToken, response.user)
    return response.user
  }

  const fetchMe = async () => {
    if (!accessToken.value) {
      initialized.value = true
      return null
    }

    try {
      const currentUser = await authService.me()
      user.value = currentUser
      return currentUser
    } catch {
      clearSession()
      return null
    } finally {
      initialized.value = true
    }
  }

  const logout = async () => {
    clearSession()
    await navigateTo('/auth/login')
  }

  return {
    user,
    accessToken,
    initialized,
    isLoggedIn,
    role,
    login,
    fetchMe,
    logout,
  }
})